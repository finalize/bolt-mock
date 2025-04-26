import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Building2,
  Users,
  Settings,
  Bell,
  User,
  ClipboardList,
  FileSpreadsheet,
  BarChart4,
  FormInput,
  FileText,
} from "lucide-react";
import Dashboard from "@/pages/Dashboard";
import SurveyList from "@/pages/SurveyList";
import TakeSurvey from "@/pages/TakeSurvey";
import SurveyResults from "@/pages/SurveyResults";
import AssessmentPage from "@/pages/Assessment";
import AssessmentList from "@/pages/AssessmentList";
import AssessmentResults from "@/pages/AssessmentResults"; // 追加

const sidebarItems = [
  { icon: BarChart3, label: "ダッシュボード", path: "/" },
  { icon: Building2, label: "企業管理", path: "/companies" },
  { icon: ClipboardList, label: "契約管理", path: "/contracts" },
  {
    icon: FileText,
    label: "アセスメント",
    path: "/assessments",
    subItems: [
      { label: "アセスメント一覧", path: "/assessments" },
      // { label: "新規作成", path: "/assessments/create" },
      { label: "結果一覧", path: "/assessments/results" }, // 結果一覧へのリンクを追加（仮）
    ],
  },
  {
    icon: BarChart4,
    label: "サーベイ",
    path: "/surveys",
    subItems: [
      { label: "サーベイ一覧", path: "/surveys" },
      { label: "新規作成", path: "/surveys/create" },
      { label: "結果一覧", path: "/surveys/results" }, // 結果一覧へのリンクを追加（仮）
    ],
  },
  { icon: Users, label: "管理者管理", path: "/users" },
  { icon: Settings, label: "設定", path: "/settings" },
];

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActiveParent = (path: string) => {
    if (path === "/") {
      return currentPath === path;
    }
    // サイドバーの親項目アクティブ判定を修正
    if (path === "/assessments" && currentPath.startsWith("/assessments")) {
        return true;
    }
    if (path === "/surveys" && currentPath.startsWith("/surveys")) {
        return true;
    }
    // 他のトップレベル項目
    return currentPath.startsWith(path) && path !== "/" && !currentPath.includes('/', path.length + 1);
  };

   const isActiveSubItem = (path: string) => {
     // 結果ページも親アクティブにするための調整
     if (path === "/assessments/results" && currentPath.startsWith("/assessments/results")) return true;
     if (path === "/surveys/results" && currentPath.startsWith("/surveys/results")) return true;
     // 通常のサブアイテム判定
     return currentPath === path;
   };

  const isLoginPage = currentPath === "/login";
  const isTakingAssessment = currentPath.startsWith("/assessments/take/");
  const isTakingSurvey = currentPath.startsWith("/surveys/take/");
  // 結果ページでもサイドバーを非表示にする場合は条件追加
  // const isViewingResults = currentPath.startsWith("/assessments/results/") || currentPath.startsWith("/surveys/results/");
  const showSidebar = !isLoginPage && !isTakingAssessment && !isTakingSurvey; // && !isViewingResults;

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow fixed w-full z-20 print:hidden">
        <div className="flex justify-between items-center px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            SHIFT AI管理ポータル
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/login")}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {showSidebar && (
         <aside className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg pt-16 overflow-y-auto z-10 print:hidden">
          <nav className="p-4">
            {sidebarItems.map((item, index) => (
              <div key={index} className="mb-1">
                <Button
                  variant={isActiveParent(item.path) ? "secondary" : "ghost"}
                  className={`w-full justify-start ${
                    isActiveParent(item.path) ? "bg-gray-100" : ""
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>

                {item.subItems && isActiveParent(item.path) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <Button
                        key={subIndex}
                        variant={
                          isActiveSubItem(subItem.path) ? "secondary" : "ghost"
                        }
                        size="sm"
                        className={`w-full justify-start text-sm ${
                          isActiveSubItem(subItem.path) ? "bg-gray-100" : ""
                        }`}
                        onClick={() => navigate(subItem.path)}
                      >
                        {subItem.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
      )}

      <main className={`pt-16 ${showSidebar ? 'pl-64' : 'pl-0'} print:pt-0 print:pl-0`}>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          {/* サーベイ関連 */}
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/surveys/take/:id" element={<TakeSurvey />} />
          <Route path="/surveys/results/:id" element={<SurveyResults />} />
           {/* 仮の結果一覧ルート */}
          <Route path="/surveys/results" element={<div className="p-8">サーベイ結果一覧（実装予定）</div>} />
          <Route
            path="/surveys/create"
            element={<div className="p-8">サーベイ作成ページ（実装予定）</div>}
          />

          {/* アセスメント関連 */}
          <Route path="/assessments" element={<AssessmentList />} />
          <Route path="/assessments/take/:id" element={<AssessmentPage />} />
          <Route path="/assessments/results/:id" element={<AssessmentResults />} /> {/* 更新 */}
           {/* 仮の結果一覧ルート */}
          <Route path="/assessments/results" element={<div className="p-8">アセスメント結果一覧（実装予定）</div>} />
           {/* <Route
            path="/assessments/create"
            element={<div className="p-8">アセスメント作成ページ（実装予定）</div>}
          /> */}

          {/* その他 */}
          <Route
            path="/companies"
            element={<div className="p-8">企業管理ページ（実装予定）</div>}
          />
          <Route
            path="/contracts"
            element={<div className="p-8">契約管理ページ（実装予定）</div>}
          />
          <Route
            path="/users"
            element={<div className="p-8">管理者管理ページ（実装予定）</div>}
          />
          <Route
            path="/settings"
            element={<div className="p-8">設定ページ（実装予定）</div>}
          />
          <Route
            path="/login"
            element={<div className="p-8">ログインページ（実装予定）</div>}
          />
          {/* Not Found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
