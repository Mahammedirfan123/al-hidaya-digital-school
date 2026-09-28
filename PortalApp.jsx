"use client";

import React, { useState } from "react";
import { COLORS, FONT_IMPORT } from "@/lib/theme";
import {
  TEACHERS,
  PARENTS,
  seedHomework,
  seedLessons,
  ELIGIBILITY,
  FEE_CATEGORIES,
  APPROVALS_SEED,
  SUGGESTIONS_SEED,
  ANNOUNCEMENTS_SEED,
  MESSAGES_SEED,
  PARENT_MEETINGS_SEED,
  STUDY_MATERIALS_SEED,
  AUDIT_LOG_SEED,
  NOTIFICATIONS_SEED
} from "@/lib/data/seed";
import { LoginPage, RegisterPage } from "@/components/auth/AuthScreens";
import { AcadAttendanceMgmt, AcadClassworkMgmt, AcadExamsMgmt, AcadHomeworkMgmt, AcadMarksMgmt, AcadReportCardsMgmt } from "@/components/management/ManagementAcademics";
import { AdminApprovals, AdminAudit, AdminMeetings, AdminReports, AdminSuggestions } from "@/components/management/ManagementAdministration";
import { ManagementDashboard } from "@/components/management/ManagementDashboard";
import { FinFeesMgmt, FinPaymentsMgmt, FinVanMgmt } from "@/components/management/ManagementFinance";
import { SchClasses, SchParents, SchStudents, SchTeachers } from "@/components/management/ManagementSchool";
import { AcadExams, AcadReport, AcadResults } from "@/components/parent/ParentAcademics";
import { AccountProfile, AccountSettings } from "@/components/parent/ParentAccount";
import { CommMessages, CommSuggestions } from "@/components/parent/ParentCommunication";
import { ParentDashboard } from "@/components/parent/ParentDashboard";
import { FinFees, FinReceipts, FinVan } from "@/components/parent/ParentFinance";
import { ChildAttendance, ChildClasswork, ChildHomework, ChildMaterials, ChildOverview, ChildToday } from "@/components/parent/ParentMyChild";
import { SchoolAnnouncements, SchoolEvents, SchoolMeetings, SchoolTimetable } from "@/components/parent/ParentSchool";
import { HomeworkDetail } from "@/components/shared/HomeworkModals";
import { GlobalSearch, NotificationsDrawer } from "@/components/shell/SearchAndNotifications";
import { BottomNav, MoreMenu, Sidebar, TopBar } from "@/components/shell/Shell";
import { AssessExams, AssessInternal, AssessMarks, AssessResults } from "@/components/teacher/TeacherAssessment";
import { CommAnnouncements, CommParentMsg, CommSuggestionsTeacher } from "@/components/teacher/TeacherCommunication";
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard";
import { TeachAttendance, TeachClasses, TeachClasswork, TeachHomework, TeachMaterials, TeachToday } from "@/components/teacher/TeacherTeaching";
import { Toast } from "@/components/ui/Primitives";

export default function PortalApp() {
  const [authView, setAuthView] = useState("login"); // login | register
  const [registerRole, setRegisterRole] = useState("parent");
  const [session, setSession] = useState(null); // { role }
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState("dashboard");
  const [toastMsg, setToastText] = useState("");
  const [detail, setDetail] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // ---- central data store ----
  const [homework, setHomework] = useState(seedHomework);
  const [lessons, setLessons] = useState(seedLessons);
  const [approvals, setApprovals] = useState(APPROVALS_SEED);
  const [suggestions, setSuggestions] = useState(SUGGESTIONS_SEED);
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS_SEED);
  const [messages, setMessages] = useState(MESSAGES_SEED);
  const [parentMeetings, setParentMeetings] = useState(PARENT_MEETINGS_SEED);
  const [studyMaterials, setStudyMaterials] = useState(STUDY_MATERIALS_SEED);
  const [feeCategories, setFeeCategories] = useState(FEE_CATEGORIES);
  const [teachers, setTeachers] = useState(TEACHERS);
  const [parents, setParents] = useState(PARENTS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_SEED);
  const [auditLog, setAuditLog] = useState(AUDIT_LOG_SEED);
  const [eligibility] = useState(ELIGIBILITY);

  const toast = (t) => setToastText(t);

  const ctx = {
    homework, setHomework, lessons, setLessons, approvals, setApprovals, suggestions, setSuggestions,
    announcements, setAnnouncements, messages, setMessages, parentMeetings, setParentMeetings,
    studyMaterials, setStudyMaterials, feeCategories, setFeeCategories, teachers, setTeachers,
    parents, setParents, notifications, setNotifications, auditLog, setAuditLog, eligibility,
  };

  const handleLogin = (role) => {
    setSession({ role });
    setPage("dashboard");
    setNotice("");
  };
  const handleLogout = () => { setSession(null); setAuthView("login"); setNotice("You have been logged out."); };
  const goRegister = (role) => { setRegisterRole(role); setAuthView("register"); };
  const goLogin = () => setAuthView("login");

  if (!session) {
    if (authView === "register") return <RegisterPage role={registerRole} onSubmit={() => {}} goLogin={goLogin} />;
    return <LoginPage onLogin={handleLogin} goRegister={goRegister} notice={notice} />;
  }

  const role = session.role;
  const user = role === "parent"
    ? { name: "Rukhsana Fathima", detail: "Parent · Ayesha Fathima, Grade 5A" }
    : role === "teacher"
    ? { name: "Mr. Farooq", detail: "Class Teacher · Grade 5A · Social Science" }
    : { name: "Admin Office", detail: "Management" };

  const notifCount = notifications.length;

  const openDetail = (hw) => setDetail(hw);

  let content;
  switch (page) {
    case "dashboard":
      content = role === "parent" ? <ParentDashboard ctx={ctx} setPage={setPage} />
        : role === "teacher" ? <TeacherDashboard ctx={ctx} setPage={setPage} teacherUser={user} />
        : <ManagementDashboard ctx={ctx} setPage={setPage} />;
      break;
    // Parent
    case "child.overview": content = <ChildOverview ctx={ctx} />; break;
    case "child.attendance": content = <ChildAttendance />; break;
    case "child.today": content = <ChildToday ctx={ctx} />; break;
    case "child.homework": content = <ChildHomework ctx={ctx} openDetail={openDetail} />; break;
    case "child.classwork": content = <ChildClasswork ctx={ctx} />; break;
    case "child.materials": content = <ChildMaterials ctx={ctx} />; break;
    case "acad.exams": content = <AcadExams ctx={ctx} />; break;
    case "acad.results": content = <AcadResults />; break;
    case "acad.report": content = <AcadReport toast={toast} />; break;
    case "school.timetable": content = <SchoolTimetable />; break;
    case "school.announcements": content = <SchoolAnnouncements ctx={ctx} />; break;
    case "school.events": content = <SchoolEvents />; break;
    case "school.meetings": content = <SchoolMeetings ctx={ctx} />; break;
    case "fin.fees": content = <FinFees ctx={ctx} toast={toast} />; break;
    case "fin.van": content = <FinVan toast={toast} />; break;
    case "fin.receipts": content = <FinReceipts ctx={ctx} />; break;
    case "comm.messages": content = <CommMessages ctx={ctx} />; break;
    case "comm.suggestions": content = <CommSuggestions ctx={ctx} setSuggestions={setSuggestions} toast={toast} />; break;
    case "account.profile": content = <AccountProfile user={user} />; break;
    case "account.settings": content = <AccountSettings onLogout={handleLogout} />; break;
    // Teacher
    case "teach.classes": content = <TeachClasses />; break;
    case "teach.today": content = <TeachToday ctx={ctx} setLessons={setLessons} toast={toast} />; break;
    case "teach.attendance": content = <TeachAttendance toast={toast} />; break;
    case "teach.classwork": content = <TeachClasswork ctx={ctx} />; break;
    case "teach.homework": content = <TeachHomework ctx={ctx} setHomework={setHomework} openDetail={openDetail} toast={toast} teacherUser={user} />; break;
    case "teach.materials": content = <TeachMaterials ctx={ctx} setStudyMaterials={setStudyMaterials} toast={toast} />; break;
    case "assess.exams": content = <AssessExams />; break;
    case "assess.marks": content = <AssessMarks toast={toast} />; break;
    case "assess.internal": content = <AssessInternal />; break;
    case "assess.results": content = <AssessResults />; break;
    case "comm.announcements": content = <CommAnnouncements ctx={ctx} setAnnouncements={setAnnouncements} toast={toast} />; break;
    case "comm.parentmsg": content = <CommParentMsg ctx={ctx} />; break;
    // Management
    case "sch.students": content = <SchStudents />; break;
    case "sch.parents": content = <SchParents ctx={ctx} setParents={setParents} setApprovals={setApprovals} toast={toast} />; break;
    case "sch.teachers": content = <SchTeachers ctx={ctx} setTeachers={setTeachers} toast={toast} />; break;
    case "sch.classes": content = <SchClasses />; break;
    case "acad.attendance": content = <AcadAttendanceMgmt />; break;
    case "acad.homework": content = <AcadHomeworkMgmt ctx={ctx} />; break;
    case "acad.classwork": content = <AcadClassworkMgmt ctx={ctx} />; break;
    case "acad.marks": content = <AcadMarksMgmt />; break;
    case "acad.reportcards": content = <AcadReportCardsMgmt />; break;
    case "fin.payments": content = <FinPaymentsMgmt ctx={ctx} setFeeCategories={setFeeCategories} setApprovals={setApprovals} toast={toast} />; break;
    case "admin.approvals": content = <AdminApprovals ctx={ctx} setApprovals={setApprovals} setTeachers={setTeachers} setParents={setParents} toast={toast} />; break;
    case "admin.meetings": content = <AdminMeetings ctx={ctx} setParentMeetings={setParentMeetings} toast={toast} />; break;
    case "admin.suggestions": content = <AdminSuggestions ctx={ctx} setSuggestions={setSuggestions} toast={toast} />; break;
    case "admin.reports": content = <AdminReports />; break;
    case "admin.audit": content = <AdminAudit ctx={ctx} />; break;
    default:
      // shared ids used by both teacher & management (acad.exams already mapped for parent above)
      if (page === "comm.suggestions" && role === "teacher") content = <CommSuggestionsTeacher ctx={ctx} setSuggestions={setSuggestions} toast={toast} />;
      else content = <div style={{ padding: 30, textAlign: "center", color: COLORS.textMuted }}>Coming soon.</div>;
  }
  // teacher's suggestion page id overlaps with parent's — route explicitly
  if (role === "teacher" && page === "comm.suggestions") content = <CommSuggestionsTeacher ctx={ctx} setSuggestions={setSuggestions} toast={toast} />;
  if (role === "teacher" && page === "assess.exams") content = <AssessExams />;
  if (role === "management" && page === "fin.van") content = <FinVanMgmt />;
  if (role === "management" && page === "fin.fees") content = <FinFeesMgmt ctx={ctx} />;
  if (role === "management" && page === "acad.exams") content = <AcadExamsMgmt ctx={ctx} toast={toast} />;

  return (
    <div style={{ background: COLORS.paper, minHeight: "100vh" }}>
      <style>{`${FONT_IMPORT} * { box-sizing: border-box; } select, input, textarea, button { font-family: 'Public Sans', sans-serif; }
        body { margin: 0; }
        @media (max-width: 900px) {
          .desktop-sidebar { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-bottomnav { display: flex !important; }
          .app-main { padding-bottom: 74px !important; }
          .parent-grid { grid-template-columns: 1fr !important; }
          .mgmt-grid { grid-template-columns: 1fr !important; }
          .dash-grid { grid-template-columns: repeat(2,1fr) !important; }
          .messages-grid { grid-template-columns: 1fr !important; }
        }`}</style>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <Sidebar role={role} page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        <div className="app-main" style={{ flex: 1, minWidth: 0 }}>
          <TopBar user={user} role={role} page={page} notifCount={notifCount} onBell={() => setShowNotif(true)} onSearch={() => setShowSearch(true)} />
          <div style={{ padding: "18px 18px 40px", maxWidth: 1100 }}>
            {content}
          </div>
        </div>
      </div>

      <BottomNav role={role} page={page} setPage={setPage} onMore={() => setShowMore(true)} />
      {showMore && <MoreMenu role={role} setPage={setPage} onClose={() => setShowMore(false)} onLogout={handleLogout} />}
      {showSearch && <GlobalSearch ctx={ctx} onClose={() => setShowSearch(false)} setPage={setPage} />}
      {showNotif && <NotificationsDrawer ctx={ctx} onClose={() => setShowNotif(false)} />}
      {detail && <HomeworkDetail hw={detail} onClose={() => setDetail(null)} role={role} toast={toast} />}
      <Toast text={toastMsg} onDone={() => setToastText("")} />
    </div>
  );
}

