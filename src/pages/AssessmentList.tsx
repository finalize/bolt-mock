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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Play,
  RotateCcw, // 再開アイコン
  Eye,
  Clock,
  ListChecks, // 質問数アイコン
  HelpCircle,
  ArrowUpDown,
  Plus,
  FileText, // アセスメントアイコン
} from "lucide-react";

// アセスメントのステータスタイプ（例）
type AssessmentStatus = "available" | "in-progress" | "completed"; // 必要に応じて拡張

// アセスメントリスト項目データ型
interface AssessmentListItem {
  id: number;
  title: string;
  description: string;
  status: AssessmentStatus; // このユーザーの受験ステータス
  estimatedTime: string;
  questionCount: number;
  category?: string; // 例: スキル、性格など
  lastAttempted?: string; // 最終試行日時
}

// モックのアセスメントリストデータ
const mockAssessmentList: AssessmentListItem[] = [
  {
    id: 101, // Assessment.tsx のモックデータと合わせる
    title: "総合スキルアセスメント",
    description: "論理思考、コミュニケーション、問題解決能力などを総合的に評価します。",
    status: "available", // 初期状態
    estimatedTime: "約60分",
    questionCount: 145, // Assessment.tsx のモックデータと合わせる
    category: "スキル",
  },
  {
    id: 102,
    title: "パーソナリティ診断",
    description: "あなたの性格特性や行動傾向を分析します。",
    status: "available",
    estimatedTime: "約30分",
    questionCount: 80,
    category: "性格",
  },
  {
    id: 103,
    title: "リーダーシップ適性検査",
    description: "リーダーとしての潜在能力やスタイルを評価します。",
    status: "available",
    estimatedTime: "約45分",
    questionCount: 100,
    category: "適性",
  },
];

export default function AssessmentList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // ステート
  const [assessments, setAssessments] = useState<AssessmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof AssessmentListItem>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // アセスメントデータを取得し、ローカルストレージから進捗を確認
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        // TODO: APIからアセスメントリストを取得する
        // const fetchedList = await fetchAssessmentListApi();

        // ローカルストレージから各アセスメントの進捗を確認
        const updatedList = mockAssessmentList.map((assessment) => {
          const savedData = localStorage.getItem(`assessment_${assessment.id}`);
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              // 簡単なチェック（より厳密なチェックも可能）
              if (parsed && typeof parsed.currentQuestionIndex === 'number') {
                return { ...assessment, status: "in-progress" as AssessmentStatus };
              }
            } catch (e) {
              console.error("Failed to parse saved assessment data:", e);
              // パース失敗時はローカルストレージのデータを削除するなどの対応も検討
              localStorage.removeItem(`assessment_${assessment.id}`);
            }
          }
          // TODO: 完了状態をAPIなどから取得するロジックを追加
          // if (isAssessmentCompleted(assessment.id)) {
          //   return { ...assessment, status: "completed" };
          // }
          return assessment;
        });

        setAssessments(updatedList);
        setLoading(false);
      } catch (error) {
        console.error("アセスメントリストの取得に失敗しました", error);
        toast({
          title: "エラー",
          description:
            "アセスメントリストの取得に失敗しました。後でもう一度お試しください。",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [toast]);

  // フィルタリングおよびソート適用
  const filteredAssessments = assessments
    .filter((assessment) => {
      // 検索語でフィルタリング
      return (
        searchTerm === "" ||
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assessment.category && assessment.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        const stringA = String(valueA).toLowerCase();
        const stringB = String(valueB).toLowerCase();
        return sortDirection === "asc"
          ? stringA.localeCompare(stringB)
          : stringB.localeCompare(stringA);
      }
    });

  // アセスメント受験ページへ遷移
  const handleStartOrResumeAssessment = (id: number) => {
    navigate(`/assessments/take/${id}`);
  };

   // アセスメント詳細ページへ遷移（将来用）
   const handleViewDetails = (id: number) => {
    // navigate(`/assessments/details/${id}`); // 詳細ページへのルート
    toast({ title: "未実装", description: `アセスメント ${id} の詳細表示は現在実装中です。` });
  };

  // 新規アセスメント作成ページへ遷移（管理者向け機能として将来用）
  const handleCreateAssessment = () => {
    // navigate("/assessments/create");
     toast({ title: "未実装", description: "新規アセスメント作成機能は現在実装中です。" });
  };

  // ソート切り替え
  const toggleSort = (field: keyof AssessmentListItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ステータスに応じたバッジスタイルを返す関数
  const getStatusBadgeStyle = (status: AssessmentStatus) => {
    switch (status) {
      case "available":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // ステータスラベルを返す関数
  const getStatusLabel = (status: AssessmentStatus) => {
    switch (status) {
      case "available":
        return "未開始";
      case "in-progress":
        return "中断中";
      case "completed":
        return "完了";
      default:
        return "不明";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            アセスメント一覧
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            利用可能なアセスメントを確認し、受験を開始または再開します。
          </p>
        </div>
        {/* 管理者向け機能として表示制御が必要かも */}
        {/* <Button onClick={handleCreateAssessment}>
          <Plus className="mr-2 h-4 w-4" />
          新規アセスメント作成
        </Button> */}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="アセスメントを検索 (タイトル, 説明, カテゴリ)..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* 必要であればフィルターを追加 */}
        {/* <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">フィルター:</p>
        </div>
        <Select>...</Select> */}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[350px]">
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
                    onClick={() => toggleSort("category")}
                  >
                    カテゴリ
                    {sortField === "category" && (
                      <ArrowUpDown className="ml-2 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                 <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-transparent"
                    onClick={() => toggleSort("questionCount")}
                  >
                    問題数
                    {sortField === "questionCount" && (
                      <ArrowUpDown className="ml-2 h-3 w-3 inline" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-transparent"
                    onClick={() => toggleSort("estimatedTime")}
                  >
                    目安時間
                    {sortField === "estimatedTime" && (
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
                <TableHead className="text-right">アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p>読み込み中...</p>
                  </TableCell>
                </TableRow>
              ) : filteredAssessments.length > 0 ? (
                filteredAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">
                      <div>{assessment.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {assessment.description}
                      </div>
                    </TableCell>
                    <TableCell>{assessment.category || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ListChecks className="h-3 w-3 text-muted-foreground mr-1" />
                        {assessment.questionCount} 問
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                        {assessment.estimatedTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeStyle(assessment.status)}>
                        {getStatusLabel(assessment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {assessment.status !== "completed" && ( // 完了済みは表示しない例
                          <Button
                            variant={assessment.status === "in-progress" ? "secondary" : "default"}
                            size="sm"
                            onClick={() => handleStartOrResumeAssessment(assessment.id)}
                          >
                            {assessment.status === "in-progress" ? (
                              <RotateCcw className="h-3 w-3 mr-1" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            {assessment.status === "in-progress" ? "再開" : "開始"}
                          </Button>
                        )}
                        {/* 詳細ボタン（将来用） */}
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(assessment.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          詳細
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <HelpCircle className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">
                        アセスメントが見つかりません
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        利用可能なアセスメントはありません。検索条件を変更してみてください。
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
