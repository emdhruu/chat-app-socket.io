import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { useChatStore } from "../store/useChatStore";
import { useGroupState } from "../store/useGroupStore";
import DetailPage from "./DetailPage";
import { useDetailStore } from "../store/useDetailStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { selectedGroup } = useGroupState();
  const { selectedDetailPage, setSelectedDetailPage } = useDetailStore();

  const isChatSelected = selectedUser || selectedGroup;
  // console.log("on",selectedDetailPage);
  

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!isChatSelected ? (
              <NoChatSelected />
            ) : selectedDetailPage ? (
              <DetailPage onClose={setSelectedDetailPage} />
            ) : (
              <ChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
