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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  HelpCircle,
  Loader2,
  Clock,
} from "lucide-react";

// サーベイの質問タイプ
type QuestionType = "single" | "multiple" | "rating" | "text" | "boolean";

// 質問オプション
interface QuestionOption {
  id: number;
  text: string;
  nextQuestionId?: number; // 条件分岐用
}

// 質問データ型
interface Question {
  id: number;
  text: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
  minRating?: number;
  maxRating?: number;
}

// サーベイデータ型
interface Survey {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
  questions: Question[];
}

// 回答データ型
interface Answer {
  questionId: number;
  value: string | string[] | number | boolean | null;
}

// モックサーベイデータ
const mockSurvey: Survey = {
  id: 1,
  title: "四半期エンゲージメント調査",
  description:
    "このサーベイは現在の職場環境と従業員エンゲージメントを評価するためのものです。あなたの正直な意見をお聞かせください。",
  estimatedTime: "約10分",
  questions: [
    {
      id: 1,
      text: "あなたの所属部署を選択してください",
      type: "single",
      required: true,
      options: [
        { id: 1, text: "営業部" },
        { id: 2, text: "マーケティング部" },
        { id: 3, text: "エンジニアリング部", nextQuestionId: 3 },
        { id: 4, text: "人事部" },
        { id: 5, text: "経営管理部" },
      ],
    },
    {
      id: 2,
      text: "勤続年数を選択してください",
      type: "single",
      required: true,
      options: [
        { id: 1, text: "1年未満" },
        { id: 2, text: "1-3年" },
        { id: 3, text: "3-5年" },
        { id: 4, text: "5-10年" },
        { id: 5, text: "10年以上" },
      ],
    },
    {
      id: 3,
      text: "現在の職場環境にどの程度満足していますか？",
      description: "1（非常に不満）から5（非常に満足）の尺度でお答えください",
      type: "rating",
      required: true,
      minRating: 1,
      maxRating: 5,
    },
    {
      id: 4,
      text: "職場で最も価値を感じる側面はどれですか？（複数選択可）",
      type: "multiple",
      required: true,
      options: [
        { id: 1, text: "給与・待遇" },
        { id: 2, text: "キャリア成長の機会" },
        { id: 3, text: "同僚との関係" },
        { id: 4, text: "仕事と生活のバランス" },
        { id: 5, text: "会社の使命・ビジョン" },
        { id: 6, text: "学習・成長の機会" },
      ],
    },
    {
      id: 5,
      text: "チームのコミュニケーションは効果的であると感じますか？",
      type: "boolean",
      required: true,
    },
    {
      id: 6,
      text: "職場環境や従業員エンゲージメントを向上させるための提案があれば教えてください。",
      type: "text",
      required: false,
    },
  ],
};

export default function TakeSurvey() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // ステート
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState<boolean>(false);

  // サーベイデータを取得
  useEffect(() => {
    // 実際の実装ではAPIからデータを取得する
    const fetchSurvey = async () => {
      try {
        // API呼び出しの代わりにモックデータを使用
        setTimeout(() => {
          setSurvey(mockSurvey);
          setLoading(false);

          // ローカルストレージから途中保存データを復元
          const savedData = localStorage.getItem(`survey_${mockSurvey.id}`);
          if (savedData) {
            const parsed = JSON.parse(savedData);
            setAnswers(parsed.answers || []);
            setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
            setSavedAnswers(true);
          }
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

    fetchSurvey();
  }, [id, toast]);

  // 現在の質問
  const currentQuestion = survey?.questions[currentQuestionIndex];

  // 進捗率を計算
  const progressPercentage = survey
    ? ((currentQuestionIndex + 1) / survey.questions.length) * 100
    : 0;

  // 回答を更新
  const updateAnswer = (value: string | string[] | number | boolean | null) => {
    if (!currentQuestion) return;

    setAnswers((prevAnswers) => {
      // 既存の回答を探す
      const existingAnswerIndex = prevAnswers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        value,
      };

      // 既存の回答を更新するか、新しい回答を追加
      if (existingAnswerIndex >= 0) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = newAnswer;
        return updatedAnswers;
      } else {
        return [...prevAnswers, newAnswer];
      }
    });
  };

  // 現在の質問に対する回答を取得
  const getCurrentAnswer = (): Answer["value"] => {
    if (!currentQuestion) return null;

    const answer = answers.find((a) => a.questionId === currentQuestion.id);
    return answer ? answer.value : null;
  };

  // 次の質問に進む
  const handleNext = () => {
    if (!currentQuestion) return;

    // 必須入力チェック
    if (currentQuestion.required && getCurrentAnswer() === null) {
      toast({
        title: "入力エラー",
        description: "この質問は必須です。回答を入力してください。",
        variant: "destructive",
      });
      return;
    }

    // 条件分岐チェック
    if (currentQuestion.type === "single" && currentQuestion.options) {
      const selectedOptionId = Number(getCurrentAnswer());
      const selectedOption = currentQuestion.options.find(
        (opt) => opt.id === selectedOptionId
      );

      if (selectedOption?.nextQuestionId) {
        // 条件分岐で特定の質問にジャンプ
        const targetQuestionIndex = survey?.questions.findIndex(
          (q) => q.id === selectedOption.nextQuestionId
        );
        if (targetQuestionIndex !== undefined && targetQuestionIndex >= 0) {
          setCurrentQuestionIndex(targetQuestionIndex);
          return;
        }
      }
    }

    // 通常の次の質問に進む
    if (currentQuestionIndex < (survey?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // 全ての質問に回答した場合、完了画面へ
      handleSubmitSurvey();
    }
  };

  // 前の質問に戻る
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  // サーベイを保存
  const handleSave = async () => {
    setSaveInProgress(true);

    try {
      // 実際の実装ではAPIに保存する
      // ここではローカルストレージに保存
      const saveData = {
        surveyId: survey?.id,
        answers,
        currentQuestionIndex,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(`survey_${survey?.id}`, JSON.stringify(saveData));

      setSaveInProgress(false);
      setSaveDialogOpen(false);
      setSavedAnswers(true);

      toast({
        title: "保存完了",
        description: "回答が正常に保存されました。後で続きから再開できます。",
      });
    } catch (error) {
      console.error("保存に失敗しました", error);
      setSaveInProgress(false);

      toast({
        title: "保存エラー",
        description:
          "回答の保存に失敗しました。ネットワーク接続を確認してください。",
        variant: "destructive",
      });
    }
  };

  // サーベイを提出
  const handleSubmitSurvey = async () => {
    try {
      // 実際の実装ではAPIに送信する
      // モックの遅延を追加
      toast({
        title: "送信中...",
        description: "サーベイの回答を送信しています。",
      });

      // モックの送信遅延
      setTimeout(() => {
        // 送信成功後、結果ページへ
        navigate(`/surveys/results/${survey?.id}`);
      }, 1000);
    } catch (error) {
      console.error("サーベイの送信に失敗しました", error);
      toast({
        title: "送信エラー",
        description:
          "サーベイの送信に失敗しました。後でもう一度お試しください。",
        variant: "destructive",
      });
    }
  };

  // 質問の種類に応じた入力コンポーネントを表示
  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    const currentValue = getCurrentAnswer();

    switch (currentQuestion.type) {
      case "single":
        return (
          <RadioGroup
            value={currentValue as string}
            onValueChange={(value) => updateAnswer(value)}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={String(option.id)}
                  id={`option-${option.id}`}
                />
                <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple":
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => {
              const values = (currentValue as string[]) || [];
              return (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${option.id}`}
                    checked={values.includes(String(option.id))}
                    onCheckedChange={(checked) => {
                      const optionId = String(option.id);
                      if (checked) {
                        updateAnswer([
                          ...((currentValue as string[]) || []),
                          optionId,
                        ]);
                      } else {
                        updateAnswer(
                          ((currentValue as string[]) || []).filter(
                            (id) => id !== optionId
                          )
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`option-${option.id}`}>{option.text}</Label>
                </div>
              );
            })}
          </div>
        );

      case "rating":
        const minRating = currentQuestion.minRating || 1;
        const maxRating = currentQuestion.maxRating || 5;
        const ratings = Array.from(
          { length: maxRating - minRating + 1 },
          (_, i) => minRating + i
        );

        return (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                {minRating} (最低)
              </span>
              <span className="text-sm text-muted-foreground">
                {maxRating} (最高)
              </span>
            </div>
            <div className="flex justify-between gap-2">
              {ratings.map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant={currentValue === rating ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => updateAnswer(rating)}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>
        );

      case "text":
        return (
          <Textarea
            value={(currentValue as string) || ""}
            onChange={(e) => updateAnswer(e.target.value)}
            placeholder="回答を入力してください..."
            className="min-h-[100px]"
          />
        );

      case "boolean":
        return (
          <RadioGroup
            value={currentValue === null ? "" : String(currentValue)}
            onValueChange={(value) => updateAnswer(value === "true")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="boolean-yes" />
              <Label htmlFor="boolean-yes">はい</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="boolean-no" />
              <Label htmlFor="boolean-no">いいえ</Label>
            </div>
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-lg">サーベイを読み込み中...</p>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>サーベイが見つかりません</CardTitle>
            <CardDescription>
              指定されたサーベイは存在しないか、アクセス権がありません。
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{survey.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setHelpDialogOpen(true)}
            >
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {survey.estimatedTime}
            </span>
            {savedAnswers && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                保存済み
              </span>
            )}
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>
            質問 {currentQuestionIndex + 1} / {survey.questions.length}
          </span>
          <span>{Math.round(progressPercentage)}% 完了</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion?.text}</CardTitle>
          {currentQuestion?.description && (
            <CardDescription>{currentQuestion.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>{renderQuestionInput()}</CardContent>
      </Card>

      <div className="flex justify-between">
        <div>
          <Button variant="outline" onClick={() => setExitDialogOpen(true)}>
            終了
          </Button>
          <Button
            variant="outline"
            className="ml-2"
            onClick={() => setSaveDialogOpen(true)}
          >
            <Save className="mr-2 h-4 w-4" />
            途中保存
          </Button>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            前へ
          </Button>
          <Button className="ml-2" onClick={handleNext}>
            {currentQuestionIndex === survey.questions.length - 1
              ? "送信"
              : "次へ"}
            {currentQuestionIndex === survey.questions.length - 1 ? null : (
              <ArrowRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 途中保存ダイアログ */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>サーベイを保存</DialogTitle>
            <DialogDescription>
              現在の回答を保存します。後で続きから再開できます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave} disabled={saveInProgress}>
              {saveInProgress && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 終了確認ダイアログ */}
      <AlertDialog open={exitDialogOpen} onOpenChange={setExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>サーベイを終了しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              終了すると、保存されていない回答は失われます。
              {!savedAnswers && "現在の回答は保存されていません。"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/surveys")}>
              終了する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ヘルプダイアログ */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{survey.title} - ヘルプ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">概要</h3>
              <p className="text-sm text-muted-foreground">
                {survey.description}
              </p>
            </div>
            <div>
              <h3 className="font-medium">操作方法</h3>
              <ul className="text-sm text-muted-foreground list-disc ml-5 space-y-1">
                <li>「次へ」ボタンで次の質問に進みます</li>
                <li>「前へ」ボタンで前の質問に戻ります</li>
                <li>「途中保存」ボタンで現在の回答を保存できます</li>
                <li>「終了」ボタンでサーベイを終了します</li>
                <li>必須の質問には回答が必要です</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">所要時間</h3>
              <p className="text-sm text-muted-foreground">
                {survey.estimatedTime}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setHelpDialogOpen(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
