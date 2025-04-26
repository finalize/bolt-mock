import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as BarChartIcon,
  CheckCircle,
  Plus,
  TrendingUp,
  BarChart4,
  ClipboardList,
  Clock,
  ArrowRight,
  AlertCircle,
  BookOpen,
  Award,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart as RechartsBarChart,
} from "recharts";

// サーベイの概要データ
const surveyOverviewData = {
  totalSurveys: 5,
  completedSurveys: 98,
  averageCompletion: 78,
  pendingSurveys: 25,
  recentSurveys: [
    {
      id: 1,
      title: "従業員満足度調査",
      responses: 25,
      completionRate: 83,
    },
    {
      id: 2,
      title: "リモートワーク環境調査",
      responses: 18,
      completionRate: 60,
    },
    {
      id: 3,
      title: "新入社員オンボーディング評価",
      responses: 7,
      completionRate: 100,
    },
  ],
};

// アセスメントの概要データ
const assessmentOverviewData = {
  totalAssessments: 3,
  completedAssessments: 42,
  averageScore: 72,
  pendingAssessments: 15,
  recentAssessments: [
    {
      id: 1,
      title: "リーダーシップ能力評価",
      participants: 12,
      averageScore: 76,
    },
    {
      id: 2,
      title: "プロジェクト管理スキル評価",
      participants: 18,
      averageScore: 68,
    },
    {
      id: 3,
      title: "コミュニケーションスキル評価",
      participants: 24,
      averageScore: 81,
    },
  ],
};

// 未実施のサーベイデータ
const pendingSurveys = [
  {
    id: 1,
    title: "四半期エンゲージメント調査",
    deadline: "2025-05-10",
    priority: "高",
    estimatedTime: "10分",
  },
  {
    id: 2,
    title: "リモートワーク満足度調査",
    deadline: "2025-05-15",
    priority: "中",
    estimatedTime: "5分",
  },
  {
    id: 3,
    title: "社内コミュニケーション評価",
    deadline: "2025-05-20",
    priority: "低",
    estimatedTime: "15分",
  },
];

// 未受験のアセスメントデータ
const pendingAssessments = [
  {
    id: 1,
    title: "コミュニケーションスキル評価",
    deadline: "2025-05-05",
    priority: "高",
    estimatedTime: "20分",
  },
  {
    id: 2,
    title: "問題解決力アセスメント",
    deadline: "2025-05-12",
    priority: "中",
    estimatedTime: "30分",
  },
  {
    id: 3,
    title: "チームワークスキル評価",
    deadline: "2025-05-18",
    priority: "低",
    estimatedTime: "15分",
  },
];

// パーソナライズされたレコメンデーションデータ
const recommendations = [
  {
    id: 1,
    title: "リーダーシップトレーニング",
    type: "コース",
    reason: "前回のリーダーシップ評価に基づくおすすめ",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "プロジェクト管理ベストプラクティス",
    type: "アセスメント",
    reason: "あなたの役割に関連する新しいアセスメント",
    icon: Award,
  },
  {
    id: 3,
    title: "効果的なフィードバックの提供方法",
    type: "サーベイ",
    reason: "部署のスキルギャップに基づく推奨",
    icon: ClipboardList,
  },
];

// サーベイカテゴリデータ
const surveyCategories = [
  { name: "従業員満足度", value: 40 },
  { name: "業務環境", value: 25 },
  { name: "キャリア開発", value: 15 },
  { name: "福利厚生", value: 10 },
  { name: "その他", value: 10 },
];

// 月別の回答数
const monthlyResponses = [
  { name: "7月", サーベイ回答数: 65, アセスメント完了数: 35 },
  { name: "8月", サーベイ回答数: 78, アセスメント完了数: 42 },
  { name: "9月", サーベイ回答数: 91, アセスメント完了数: 53 },
  { name: "10月", サーベイ回答数: 102, アセスメント完了数: 61 },
  { name: "11月", サーベイ回答数: 125, アセスメント完了数: 72 },
  { name: "12月", サーベイ回答数: 110, アセスメント完了数: 68 },
];

// グラフの色
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // 新規サーベイ作成ページへ遷移
  const handleCreateSurvey = () => {
    navigate("/surveys/create");
  };

  // サーベイ一覧ページへ遷移
  const handleViewAllSurveys = () => {
    navigate("/surveys");
  };

  // アセスメント一覧ページへ遷移
  const handleViewAllAssessments = () => {
    navigate("/assessments");
  };

  // サーベイ実施ページへ遷移
  const handleTakeSurvey = (id: number) => {
    navigate(`/surveys/take/${id}`);
  };

  // アセスメント受験ページへ遷移
  const handleTakeAssessment = (id: number) => {
    navigate(`/assessments/take/${id}`);
  };

  // レコメンデーションアイテムをクリック
  const handleRecommendationClick = (item: (typeof recommendations)[0]) => {
    switch (item.type) {
      case "コース":
        navigate(`/courses/${item.id}`);
        break;
      case "アセスメント":
        navigate(`/assessments/take/${item.id}`);
        break;
      case "サーベイ":
        navigate(`/surveys/take/${item.id}`);
        break;
      default:
        break;
    }
  };

  // 優先度に応じたバッジスタイルを返す関数
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "高":
        return "bg-red-100 text-red-800";
      case "中":
        return "bg-yellow-100 text-yellow-800";
      case "低":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="todo">未完了タスク</TabsTrigger>
          <TabsTrigger value="surveys">サーベイ</TabsTrigger>
          <TabsTrigger value="assessments">アセスメント</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  サーベイ総数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ClipboardList className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">
                    {surveyOverviewData.totalSurveys}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  アクティブなサーベイ
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  アセスメント総数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart4 className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">
                    {assessmentOverviewData.totalAssessments}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  アクティブなアセスメント
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  サーベイ回答数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">
                    {surveyOverviewData.completedSurveys}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  完了した回答
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  平均回答率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">
                    {surveyOverviewData.averageCompletion}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  全サーベイの平均
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 未完了タスクプレビューセクションを追加 */}
          <Card>
            <CardHeader>
              <CardTitle>未完了タスク</CardTitle>
              <CardDescription>
                期限が近い未実施のサーベイとアセスメント
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                    未実施のサーベイ
                  </h3>
                  <ul className="space-y-2">
                    {pendingSurveys.slice(0, 2).map((survey) => (
                      <li
                        key={survey.id}
                        className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                      >
                        <div>
                          <p className="font-medium text-sm">{survey.title}</p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">
                              期限: {survey.deadline}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleTakeSurvey(survey.id)}
                          className="h-8"
                        >
                          実施する
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" />
                    未受験のアセスメント
                  </h3>
                  <ul className="space-y-2">
                    {pendingAssessments.slice(0, 2).map((assessment) => (
                      <li
                        key={assessment.id}
                        className="flex items-center justify-between bg-muted/50 p-2 rounded-md"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {assessment.title}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">
                              期限: {assessment.deadline}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleTakeAssessment(assessment.id)}
                          className="h-8"
                        >
                          受験する
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setActiveTab("todo")}
              >
                すべての未完了タスクを表示
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* パーソナライズされたレコメンデーション */}
          <Card>
            <CardHeader>
              <CardTitle>あなたへのおすすめ</CardTitle>
              <CardDescription>
                あなたの活動と関心に基づいてパーソナライズされたレコメンデーション
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recommendations.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRecommendationClick(item)}
                  >
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary mr-4">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center">
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded mr-2">
                          {item.type}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {item.reason}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>最近のサーベイ</CardTitle>
                <CardDescription>
                  直近に作成・更新されたサーベイ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {surveyOverviewData.recentSurveys.map((survey) => (
                    <li
                      key={survey.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{survey.title}</p>
                        <p className="text-sm text-muted-foreground">
                          回答数: {survey.responses}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {survey.completionRate}%
                        </span>
                        <div className="w-10 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${survey.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleViewAllSurveys}
                >
                  すべてのサーベイを表示
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>最近のアセスメント</CardTitle>
                <CardDescription>
                  直近に作成・更新されたアセスメント
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {assessmentOverviewData.recentAssessments.map(
                    (assessment) => (
                      <li
                        key={assessment.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{assessment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            参加者: {assessment.participants}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">
                            平均: {assessment.averageScore}点
                          </span>
                        </div>
                      </li>
                    )
                  )}
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleViewAllAssessments}
                >
                  すべてのアセスメントを表示
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>回答数の推移</CardTitle>
              <CardDescription>
                月別のサーベイ・アセスメント回答数
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyResponses}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="サーベイ回答数"
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="アセスメント完了数"
                      stroke="#00C49F"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 未完了タスクタブ（新規追加） */}
        <TabsContent value="todo" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>未実施のサーベイ</CardTitle>
                <CardDescription>
                  あなたが完了する必要のあるサーベイ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pendingSurveys.map((survey) => (
                    <li key={survey.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{survey.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getPriorityBadgeStyle(
                            survey.priority
                          )}`}
                        >
                          優先度: {survey.priority}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="mr-4">期限: {survey.deadline}</span>
                        <span>予想所要時間: {survey.estimatedTime}</span>
                      </div>
                      <Button
                        onClick={() => handleTakeSurvey(survey.id)}
                        className="w-full"
                      >
                        サーベイを実施する
                      </Button>
                    </li>
                  ))}
                </ul>
                {pendingSurveys.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p>未実施のサーベイはありません</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>未受験のアセスメント</CardTitle>
                <CardDescription>
                  あなたが完了する必要のあるアセスメント
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pendingAssessments.map((assessment) => (
                    <li key={assessment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{assessment.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${getPriorityBadgeStyle(
                            assessment.priority
                          )}`}
                        >
                          優先度: {assessment.priority}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="mr-4">
                          期限: {assessment.deadline}
                        </span>
                        <span>予想所要時間: {assessment.estimatedTime}</span>
                      </div>
                      <Button
                        onClick={() => handleTakeAssessment(assessment.id)}
                        className="w-full"
                      >
                        アセスメントを受験する
                      </Button>
                    </li>
                  ))}
                </ul>
                {pendingAssessments.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p>未受験のアセスメントはありません</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* サーベイタブ */}
        <TabsContent value="surveys" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">サーベイ管理</h2>
            <Button onClick={handleCreateSurvey}>
              <Plus className="mr-2 h-4 w-4" />
              新規サーベイ作成
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>サーベイ概要</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      サーベイ総数
                    </p>
                    <p className="text-2xl font-bold">
                      {surveyOverviewData.totalSurveys}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">総回答数</p>
                    <p className="text-2xl font-bold">
                      {surveyOverviewData.completedSurveys}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">平均回答率</p>
                    <p className="text-2xl font-bold">
                      {surveyOverviewData.averageCompletion}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      保留中の回答
                    </p>
                    <p className="text-2xl font-bold">
                      {surveyOverviewData.pendingSurveys}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">サーベイカテゴリ</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={surveyCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(0)}%)`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {surveyCategories.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>最近のサーベイ回答</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {surveyOverviewData.recentSurveys.map((survey) => (
                    <li
                      key={survey.id}
                      className="border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{survey.title}</h3>
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                          {survey.responses} 件回答
                        </span>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground mr-2">
                          回答率:
                        </p>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${survey.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium ml-2">
                          {survey.completionRate}%
                        </span>
                      </div>
                      <div className="flex mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() =>
                            navigate(`/surveys/results/${survey.id}`)
                          }
                        >
                          <BarChartIcon className="h-3 w-3 mr-1" />
                          結果を表示
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => navigate(`/surveys/edit/${survey.id}`)}
                        >
                          編集
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleViewAllSurveys}
                >
                  すべてのサーベイを表示
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* アセスメントタブ */}
        <TabsContent value="assessments" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">アセスメント管理</h2>
            <Button onClick={() => navigate("/assessments/create")}>
              <Plus className="mr-2 h-4 w-4" />
              新規アセスメント作成
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>アセスメント概要</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      アセスメント総数
                    </p>
                    <p className="text-2xl font-bold">
                      {assessmentOverviewData.totalAssessments}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      合計参加者数
                    </p>
                    <p className="text-2xl font-bold">
                      {assessmentOverviewData.completedAssessments}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">平均スコア</p>
                    <p className="text-2xl font-bold">
                      {assessmentOverviewData.averageScore} / 100
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      保留中のアセスメント
                    </p>
                    <p className="text-2xl font-bold">
                      {assessmentOverviewData.pendingAssessments}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">スコア分布</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={[
                          { range: "0-20", count: 2 },
                          { range: "21-40", count: 5 },
                          { range: "41-60", count: 12 },
                          { range: "61-80", count: 18 },
                          { range: "81-100", count: 8 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#0088FE" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>最近のアセスメント</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {assessmentOverviewData.recentAssessments.map(
                    (assessment) => (
                      <li
                        key={assessment.id}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{assessment.title}</h3>
                          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                            {assessment.participants} 名参加
                          </span>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm text-muted-foreground mr-2">
                            平均スコア:
                          </p>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${assessment.averageScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium ml-2">
                            {assessment.averageScore}/100
                          </span>
                        </div>
                        <div className="flex mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() =>
                              navigate(`/assessments/results/${assessment.id}`)
                            }
                          >
                            <BarChartIcon className="h-3 w-3 mr-1" />
                            結果を表示
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() =>
                              navigate(`/assessments/edit/${assessment.id}`)
                            }
                          >
                            編集
                          </Button>
                        </div>
                      </li>
                    )
                  )}
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={handleViewAllAssessments}
                >
                  すべてのアセスメントを表示
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 分析タブ */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>回答トレンド分析</CardTitle>
              <CardDescription>過去6ヶ月間の回答数推移</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyResponses}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="サーベイ回答数"
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="アセスメント完了数"
                      stroke="#00C49F"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>サーベイカテゴリ分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={surveyCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {surveyCategories.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>アセスメントスコア分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { range: "0-20", count: 2 },
                        { range: "21-40", count: 5 },
                        { range: "41-60", count: 12 },
                        { range: "61-80", count: 18 },
                        { range: "81-100", count: 8 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
