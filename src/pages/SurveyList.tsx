import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Search,
  Filter,
  Eye,
  BarChart3,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowUpDown,
  HelpCircle,
  Plus,
} from "lucide-react";

// サーベイのステータスタイプ
type SurveyStatus = "active" | "draft" | "completed" | "expired";

// サーベイの種類タイプ
type SurveyType =
  | "engagement"
  | "feedback"
  | "satisfaction"
  | "assessment"
  | "other";

// サーベイデータ型
interface Survey {
  id: number;
  title: string;
  description: string;
  status: SurveyStatus;
  type: SurveyType;
  createdAt: string;
  expiresAt: string;
  responsesCount: number;
  completionRate: number;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  isCompleted?: boolean; // 自分が回答済みかどうか
}

// モックのサーベイデータ
const mockSurveys: Survey[] = [
  {
    id: 1,
    title: "四半期エンゲージメント調査",
    description: "従業員エンゲージメントと職場環境に関する調査",
    status: "active",
    type: "engagement",
    createdAt: "2025-04-01T09:00:00Z",
    expiresAt: "2025-05-10T23:59:59Z",
    responsesCount: 87,
    completionRate: 68,
    priority: "high",
    estimatedTime: "10分",
  },
  {
    id: 2,
    title: "リモートワーク満足度調査",
    description: "在宅勤務環境とツールに関するフィードバック",
    status: "active",
    type: "satisfaction",
    createdAt: "2025-04-05T14:30:00Z",
    expiresAt: "2025-05-15T23:59:59Z",
    responsesCount: 56,
    completionRate: 42,
    priority: "medium",
    estimatedTime: "5分",
    isCompleted: true,
  },
  {
    id: 3,
    title: "社内コミュニケーション評価",
    description: "部署間コミュニケーションと情報共有の効率性評価",
    status: "draft",
    type: "assessment",
    createdAt: "2025-04-10T11:15:00Z",
    expiresAt: "2025-05-20T23:59:59Z",
    responsesCount: 0,
    completionRate: 0,
    priority: "low",
    estimatedTime: "15分",
  },
  {
    id: 4,
    title: "新機能フィードバック調査",
    description: "最近導入した社内ツールの新機能に関するフィードバック",
    status: "active",
    type: "feedback",
    createdAt: "2025-04-12T16:45:00Z",
    expiresAt: "2025-05-05T23:59:59Z",
    responsesCount: 45,
    completionRate: 36,
    priority: "high",
    estimatedTime: "7分",
  },
  {
    id: 5,
    title: "福利厚生満足度調査",
    description: "現在の福利厚生プログラムの評価と提案",
    status: "completed",
    type: "satisfaction",
    createdAt: "2025-03-01T10:30:00Z",
    expiresAt: "2025-03-31T23:59:59Z",
    responsesCount: 120,
    completionRate: 92,
    priority: "medium",
    estimatedTime: "8分",
    isCompleted: true,
  },
  {
    id: 6,
    title: "キャリア開発希望調査",
    description: "従業員のキャリア目標と必要なサポートに関する調査",
    status: "expired",
    type: "other",
    createdAt: "2025-02-15T09:00:00Z",
    expiresAt: "2025-03-15T23:59:59Z",
    responsesCount: 98,
    completionRate: 76,
    priority: "low",
    estimatedTime: "12分",
    isCompleted: true,
  },
];

export default function SurveyList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ステート
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof Survey>("expiresAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState("all");

  // サーベイデータを取得
  useEffect(() => {
    // 実際の実装ではAPIからデータを取得する
    const fetchSurveys = async () => {
      try {
        // API呼び出しの代わりにモックデータを使用
        setTimeout(() => {
          setSurveys(mockSurveys);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("サーベイの取得に失敗しました", error);
        toast({
          title: "エラー",
          description:
            "サーベイデータの取得に失敗しました。後でもう一度お試しください。",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [toast]);

  // フィルタリングおよびソート適用
  const filteredSurveys = surveys
    .filter((survey) => {
      // 検索語でフィルタリング
      const matchesSearch =
        searchTerm === "" ||
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase());

      // ステータスでフィルタリング
      const matchesStatus =
        statusFilter === "all" || survey.status === statusFilter;

      // タイプでフィルタリング
      const matchesType = typeFilter === "all" || survey.type === typeFilter;

      // タブでフィルタリング
      let matchesTab = true;
      if (activeTab === "pending") {
        matchesTab = survey.status === "active" && !survey.isCompleted;
      } else if (activeTab === "completed") {
        matchesTab = !!survey.isCompleted;
      } else if (activeTab === "expired") {
        matchesTab =
          survey.status === "expired" || survey.status === "completed";
      }

      return matchesSearch && matchesStatus && matchesType && matchesTab;
    })
    .sort((a, b) => {
      if (sortField === "expiresAt" || sortField === "createdAt") {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (
        sortField === "responsesCount" ||
        sortField === "completionRate"
      ) {
        return sortDirection === "asc"
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      } else {
        const valueA = String(a[sortField]).toLowerCase();
        const valueB = String(b[sortField]).toLowerCase();
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

  // サーベイ詳細ページへ遷移
  const handleViewSurvey = (id: number) => {
    navigate(`/surveys/${id}`);
  };

  // サーベイ実施ページへ遷移
  const handleTakeSurvey = (id: number) => {
    navigate(`/surveys/take/${id}`);
  };

  // サーベイ結果ページへ遷移
  const handleViewResults = (id: number) => {
    navigate(`/surveys/results/${id}`);
  };

  // 新規サーベイ作成ページへ遷移
  const handleCreateSurvey = () => {
    navigate("/surveys/create");
  };

  // ソート切り替え
  const toggleSort = (field: keyof Survey) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ステータスに応じたバッジスタイルを返す関数
  const getStatusBadgeStyle = (status: SurveyStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "expired":
        return "bg-red-100 text-red-800 hover:bg-red-200";
    }
  };

  // ステータスラベルを返す関数
  const getStatusLabel = (status: SurveyStatus) => {
    switch (status) {
      case "active":
        return "実施中";
      case "draft":
        return "下書き";
      case "completed":
        return "完了";
      case "expired":
        return "期限切れ";
    }
  };

  // タイプラベルを返す関数
  const getTypeLabel = (type: SurveyType) => {
    switch (type) {
      case "engagement":
        return "エンゲージメント";
      case "feedback":
        return "フィードバック";
      case "satisfaction":
        return "満足度";
      case "assessment":
        return "アセスメント";
      case "other":
        return "その他";
    }
  };

  // 優先度に応じたバッジスタイルを返す関数
  const getPriorityBadgeStyle = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
    }
  };

  // 優先度ラベルを返す関数
  const getPriorityLabel = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
    }
  };

  // 日付のフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">サーベイ一覧</h1>
          <p className="text-sm text-muted-foreground mt-1">
            利用可能なサーベイと回答状況の管理
          </p>
        </div>
        <Button onClick={handleCreateSurvey}>
          <Plus className="mr-2 h-4 w-4" />
          新規サーベイ作成
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="pending">
            未回答
            <Badge variant="secondary" className="ml-2">
              {
                surveys.filter((s) => s.status === "active" && !s.isCompleted)
                  .length
              }
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">回答済み</TabsTrigger>
          <TabsTrigger value="expired">期限切れ/完了</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="サーベイを検索..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">フィルター:</p>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのステータス</SelectItem>
            <SelectItem value="active">実施中</SelectItem>
            <SelectItem value="draft">下書き</SelectItem>
            <SelectItem value="completed">完了</SelectItem>
            <SelectItem value="expired">期限切れ</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="種類" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての種類</SelectItem>
            <SelectItem value="engagement">エンゲージメント</SelectItem>
            <SelectItem value="feedback">フィードバック</SelectItem>
            <SelectItem value="satisfaction">満足度</SelectItem>
            <SelectItem value="assessment">アセスメント</SelectItem>
            <SelectItem value="other">その他</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-transparent"
                    onClick={() => toggleSort("title")}
                  >
                    タイトル
                    {sortField === "title" && (
                      <ArrowUpDown className="ml-2 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-transparent"
                    onClick={() => toggleSort("status")}
                  >
                    ステータス
                    {sortField === "status" && (
                      <ArrowUpDown className="ml-2 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-transparent"
                    onClick={() => toggleSort("type")}
                  >
                    種類
                    {sortField === "type" && (
                      <ArrowUpDown className="ml-2 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-transparent"
                    onClick={() => toggleSort("priority")}
                  >
                    優先度
                    {sortField === "priority" && (
                      <ArrowUpDown className="ml-2 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-transparent"
                    onClick={() => toggleSort("expiresAt")}
                  >
                    期限
                    {sortField === "expiresAt" && (
                      <ArrowUpDown className="ml-2 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-transparent"
                    onClick={() => toggleSort("completionRate")}
                  >
                    回答率
                    {sortField === "completionRate" && (
                      <ArrowUpDown className="ml-2 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurveys.length > 0 ? (
                filteredSurveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className="font-medium">
                      <div>
                        {survey.title}
                        {survey.isCompleted && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            回答済み
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {survey.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {survey.estimatedTime}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeStyle(survey.status)}>
                        {getStatusLabel(survey.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getTypeLabel(survey.type)}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeStyle(survey.priority)}>
                        {getPriorityLabel(survey.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-sm">
                          {formatDate(survey.expiresAt)}
                        </span>
                      </div>
                      {new Date(survey.expiresAt) < new Date() && (
                        <div className="flex items-center mt-1 text-red-600 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          期限切れ
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${survey.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">
                          {survey.completionRate}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {survey.responsesCount} 件の回答
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {survey.status === "active" && !survey.isCompleted ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleTakeSurvey(survey.id)}
                          >
                            回答する
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewResults(survey.id)}
                          >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            結果
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSurvey(survey.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          詳細
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <HelpCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">
                        サーベイが見つかりません
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        検索条件に一致するサーベイはありません。フィルターを変更してみてください。
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
