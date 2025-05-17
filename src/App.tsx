import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import TaskTable from "./components/TaskTable";
import TaskFormModal from "./components/TaskFormModal";
import { Layout, Typography, Button } from "antd";
import styled from "styled-components";

const { Header, Content } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #001529;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    padding: 20px;
  }
`;

const StyledContent = styled(Content)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #f0f2f5;

  @media (max-width: 768px) {
    padding: 20px 10px;
  }
`;

const StyledButton = styled(Button)`
  @media (max-width: 768px) {
    max-width: 300px;
  }
`;

const StyledTitle = styled(Title)`
  && {
    margin: 0;
    color: white;

    @media (max-width: 768px) {
      font-size: 24px !important;
      text-align: center;
    }
  }
`;

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Provider store={store}>
      <Router>
        <StyledLayout>
          <StyledHeader>
            <StyledTitle level={2}>Advanced Todo List</StyledTitle>
            <StyledButton type="primary" onClick={() => setIsModalOpen(true)}>
              Create Task
            </StyledButton>
          </StyledHeader>
          <StyledContent>
            <Routes>
              <Route path="/" element={<TaskTable />} />
            </Routes>
            <TaskFormModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </StyledContent>
        </StyledLayout>
      </Router>
    </Provider>
  );
};

export default App;
