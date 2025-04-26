import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Loader2,
  CheckCircle2,
  Share2,
  Download,
  ArrowLeft,
  Printer,
} from "lucide-react";

// モックの回答結果データ
const mockSurveyResult = {
  id: 1,
  title: "四半期エンゲージメント調査",
  submittedAt: "2025-04-26T14:30:00Z",
  summary: {
    overallSatisfaction: 4.2,
    recommendationScore: 8.5,
    engagementScore: 76,
    completionTime: "8分",
  },
  questionResults: [
    {
      questionId: 1,
      question: "あなたの所属部署を選択してください",
      type: "single",
      results: {
        distribution: [
          { name: "営業部", value: 15 },
          { name: "マーケティング部", value: 22 },
          { name: "エンジニアリング部", value: 45 },
          { name: "人事部", value: 8 },
          { name: "経営管理部", value: 10 },
        ],
      },
    },
    {
      questionId: 3,
      question: "現在の職場環境にどの程度満足していますか？",
      type: "rating",
      results: {
        averageRating: 4.2,
        distribution: [
          { name: "1 (非常に不満)", value: 2 },
          { name: "2 (不満)", value: 5 },
          { name: "3 (普通)", value: 25 },
          { name: "4 (満足)", value: 45 },
          { name: "5 (非常に満足)", value: 23 },
        ],
      },
    },
    {
      questionId: 4,
      question: "職場で最も価値を感じる側面はどれですか？（複数選択可）",
      type: "multiple",
      results: {
        distribution: [
          { name: "給与・待遇", value: 68 },
          { name: "キャリア成長の機会", value: 75 },
          { name: "同僚との関係", value: 82 },
          { name: "仕事と生活のバランス", value: 90 },
          { name: "会社の使命・ビジョン", value: 45 },
          { name: "学習・成長の機会", value: 72 },
        ],
      },
    },
    {
      questionId: 5,
      question: "チームのコミュニケーションは効果的であると感じますか？",
      type: "boolean",
      results: {
        distribution: [
          { name: "はい", value: 75 },
          { name: "いいえ", value: 25 },
        ],
      },
    },
  ],
  insights: [
    "仕事と生活のバランスが最も価値を感じる側面として高評価を得ています",
    "チームコミュニケーションについては75%が肯定的に回答しています",
    "職場環境の満足度は平均以上ですが、さらなる改善の余地があります",
    "キャリア成長の機会と学習機会が重要な要素として挙げられています",
  ],
  recommendations: [
    "チームビルディング活動を通じてコミュニケーションをさらに強化する",
    "キャリア開発プログラムの拡充を検討する",
    "部署間のコラボレーションを促進するイニシアチブを導入する",
  ],
  comparisons: {
    previousPeriod: {
      overallSatisfaction: 3.9,
      engagementScore: 72,
    },
    industryAverage: {
      overallSatisfaction: 3.8,
      engagementScore: 68,
    },
  },
};

// グラフの色
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF6B6B",
];

export default function SurveyResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [surveyResult, setSurveyResult] = useState<
    typeof mockSurveyResult | null
  >(null);
  const [activeTab, setActiveTab] = useState("summary");

  // 結果データを取得
  useEffect(() => {
    // 実際の実装ではAPIからデータを取得する
    const fetchResults = async () => {
      try {
        // API呼び出しの代わりにモックデータを使用
        setTimeout(() => {
          setSurveyResult(mockSurveyResult);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("結果の取得に失敗しました", error);
        toast({
          title: "エラー",
          description:
            "結果データの取得に失敗しました。ネットワーク接続を確認してください。",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, toast]);

  // レポートを共有
  const handleShare = () => {
    // 実際の実装では共有機能を実装
    toast({
      title: "共有リンクをコピーしました",
      description: "結果へのリンクがクリップボードにコピーされました。",
    });
  };

  // レポートをダウンロード
  const handleDownload = () => {
    // 実際の実装ではPDF生成などの機能を実装
    toast({
      title: "ダウンロード準備中",
      description:
        "レポートのPDFを生成しています。準備ができたらダウンロードが始まります。",
    });

    // モックのダウンロード遅延
    setTimeout(() => {
      toast({
        title: "ダウンロードを開始しました",
        description: "サーベイ結果レポートのダウンロードが始まりました。",
      });
    }, 2000);
  };

  // レポートを印刷
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg">結果を読み込み中...</p>
      </div>
    );
  }

  if (!surveyResult) {
    return (
      <div className="p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>結果が見つかりません</CardTitle>
            <CardDescription>
              指定された調査結果は存在しないか、アクセス権がありません。
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate("/surveys")}>
              サーベイ一覧に戻る
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 前回との比較データを計算
  const satisfactionChange =
    surveyResult.summary.overallSatisfaction -
    surveyResult.comparisons.previousPeriod.overallSatisfaction;
  const engagementChange =
    surveyResult.summary.engagementScore -
    surveyResult.comparisons.previousPeriod.engagementScore;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/surveys")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="ml-2">
            <h1 className="text-2xl font-bold">{surveyResult.title} - 結果</h1>
            <p className="text-sm text-muted-foreground">
              提出日時:{" "}
              {new Date(surveyResult.submittedAt).toLocaleString("ja-JP")}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            共有
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            ダウンロード
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            印刷
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="summary">サマリー</TabsTrigger>
          <TabsTrigger value="details">詳細</TabsTrigger>
          <TabsTrigger value="insights">インサイト</TabsTrigger>
          <TabsTrigger value="comparison">比較</TabsTrigger>
        </TabsList>

        {/* サマリータブ */}
        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  全体満足度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">
                    {surveyResult.summary.overallSatisfaction}
                  </div>
                  <div className="text-sm text-muted-foreground">/ 5.0</div>
                </div>
                <div
                  className={`text-xs mt-1 flex items-center ${
                    satisfactionChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {satisfactionChange >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(satisfactionChange).toFixed(1)} 前回比
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  推奨スコア
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">
                    {surveyResult.summary.recommendationScore}
                  </div>
                  <div className="text-sm text-muted-foreground">/ 10.0</div>
                </div>
                <div className="text-xs mt-1 text-muted-foreground">
                  推奨意向スコア
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  エンゲージメント
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-2">
                    {surveyResult.summary.engagementScore}
                  </div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
                <div
                  className={`text-xs mt-1 flex items-center ${
                    engagementChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {engagementChange >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(engagementChange)} 前回比
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  回答所要時間
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">
                    {surveyResult.summary.completionTime}
                  </div>
                </div>
                <div className="text-xs mt-1 text-muted-foreground">
                  平均回答時間
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>主要設問の回答分布</CardTitle>
              <CardDescription>重要な質問に対する回答傾向</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 満足度の分布 */}
                <div>
                  <h3 className="text-sm font-medium mb-3">職場環境満足度</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={
                          surveyResult.questionResults[1].results.distribution
                        }
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0088FE">
                          {surveyResult.questionResults[1].results.distribution.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 価値を感じる側面 */}
                <div>
                  <h3 className="text-sm font-medium mb-3">価値を感じる側面</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={
                          surveyResult.questionResults[2].results.distribution
                        }
                        margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={120} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#00C49F">
                          {surveyResult.questionResults[2].results.distribution.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* インサイト */}
            <Card>
              <CardHeader>
                <CardTitle>主要インサイト</CardTitle>
                <CardDescription>回答から得られた重要な洞察</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {surveyResult.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 推奨アクション */}
            <Card>
              <CardHeader>
                <CardTitle>推奨アクション</CardTitle>
                <CardDescription>結果に基づく改善のための提案</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {surveyResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="bg-muted p-3 rounded-md">
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 詳細タブ */}
        <TabsContent value="details" className="space-y-6">
          {surveyResult.questionResults.map((result, index) => (
            <Card key={result.questionId} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">
                  問 {index + 1}: {result.question}
                </CardTitle>
                <CardDescription>
                  {result.type === "rating"
                    ? "評価質問"
                    : result.type === "single"
                    ? "単一選択質問"
                    : result.type === "multiple"
                    ? "複数選択質問"
                    : result.type === "boolean"
                    ? "はい/いいえ質問"
                    : "質問"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {result.type === "boolean" ? (
                      <PieChart>
                        <Pie
                          data={result.results.distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(0)}%)`
                          }
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {result.results.distribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    ) : result.type === "single" ? (
                      <PieChart>
                        <Pie
                          data={result.results.distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) =>
                            `${name} (${(percent * 100).toFixed(0)}%)`
                          }
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {result.results.distribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    ) : (
                      <BarChart
                        data={result.results.distribution}
                        margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0088FE">
                          {result.results.distribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {result.type === "rating" && (
                  <div className="mt-4 text-center">
                    <p className="font-medium">
                      平均評価: {result.results.averageRating.toFixed(1)} / 5
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* インサイトタブ */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>重要なインサイト</CardTitle>
              <CardDescription>
                回答データから抽出された主要な洞察
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {surveyResult.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-primary pl-4 py-2"
                  >
                    <p className="text-lg">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>推奨アクション</CardTitle>
              <CardDescription>
                インサイトに基づく具体的な行動推奨
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {surveyResult.recommendations.map((recommendation, index) => (
                  <Card key={index} className="bg-muted border-none">
                    <CardContent className="pt-6">
                      <p>{recommendation}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 比較タブ */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>前回調査との比較</CardTitle>
              <CardDescription>前回の調査結果との変化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">全体満足度</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "前回",
                            value:
                              surveyResult.comparisons.previousPeriod
                                .overallSatisfaction,
                          },
                          {
                            name: "今回",
                            value: surveyResult.summary.overallSatisfaction,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">
                    エンゲージメントスコア
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "前回",
                            value:
                              surveyResult.comparisons.previousPeriod
                                .engagementScore,
                          },
                          {
                            name: "今回",
                            value: surveyResult.summary.engagementScore,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>業界平均との比較</CardTitle>
              <CardDescription>同業他社の平均値との比較</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">全体満足度</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "業界平均",
                            value:
                              surveyResult.comparisons.industryAverage
                                .overallSatisfaction,
                          },
                          {
                            name: "自社",
                            value: surveyResult.summary.overallSatisfaction,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 5]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#FFBB28" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">
                    エンゲージメントスコア
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "業界平均",
                            value:
                              surveyResult.comparisons.industryAverage
                                .engagementScore,
                          },
                          {
                            name: "自社",
                            value: surveyResult.summary.engagementScore,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
