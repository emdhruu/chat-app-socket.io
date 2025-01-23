import FriendsDetails from "../components/FriendsDetails";
import GroupDetails from "../components/GroupDetails";
import { useGroupState } from "../store/useGroupStore";
import { useChatStore } from "../store/useChatStore";

const DetailPage = ({ onClose }: any) => {
  const { selectedGroup } = useGroupState();
  const {selectedUser} = useChatStore()

  const isGroupChat = !!selectedGroup;
  console.log(selectedGroup);
  console.log(selectedUser);
  

  return (
    <div className="p-2.5 overflow-auto flex flex-1 flex-col">
        {isGroupChat ? <GroupDetails onClose={onClose} /> : <FriendsDetails onClose={onClose} />}
    </div>
  );
};

export default DetailPage;
