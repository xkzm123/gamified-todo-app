import { HashRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useMidnightReset } from './hooks/useMidnightReset';
import TaskListScreen from './screens/tasks/TaskListScreen';
import AddTaskScreen from './screens/tasks/AddTaskScreen';
import EditTaskScreen from './screens/tasks/EditTaskScreen';
import HabitListScreen from './screens/habits/HabitListScreen';
import AddHabitScreen from './screens/habits/AddHabitScreen';
import EditHabitScreen from './screens/habits/EditHabitScreen';
import RewardListScreen from './screens/rewards/RewardListScreen';
import AddRewardScreen from './screens/rewards/AddRewardScreen';
import EditRewardScreen from './screens/rewards/EditRewardScreen';
import ProfileScreen from './screens/profile/ProfileScreen';

function AppShell() {
  useMidnightReset();

  return (
    <div className="app-shell">
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<TaskListScreen />} />
          <Route path="/tasks/add/:type" element={<AddTaskScreen />} />
          <Route path="/tasks/edit/:type/:id" element={<EditTaskScreen />} />
          <Route path="/habits" element={<HabitListScreen />} />
          <Route path="/habits/add" element={<AddHabitScreen />} />
          <Route path="/habits/edit/:id" element={<EditHabitScreen />} />
          <Route path="/rewards" element={<RewardListScreen />} />
          <Route path="/rewards/add" element={<AddRewardScreen />} />
          <Route path="/rewards/edit/:id" element={<EditRewardScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>

      <nav className="tab-bar">
        <NavLink to="/tasks" className={({ isActive }) => `tab-item ${isActive ? 'tab-active' : ''}`}>
          <span className="tab-icon">📋</span>
          <span className="tab-label">任务</span>
        </NavLink>
        <NavLink to="/habits" className={({ isActive }) => `tab-item ${isActive ? 'tab-active' : ''}`}>
          <span className="tab-icon">🔄</span>
          <span className="tab-label">习惯</span>
        </NavLink>
        <NavLink to="/rewards" className={({ isActive }) => `tab-item ${isActive ? 'tab-active' : ''}`}>
          <span className="tab-icon">🏪</span>
          <span className="tab-label">奖励</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `tab-item ${isActive ? 'tab-active' : ''}`}>
          <span className="tab-icon">👤</span>
          <span className="tab-label">我的</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
