import FriendsDetails from "../components/FriendsDetails";
import GroupDetails from "../components/GroupDetails";
import { useGroupState } from "../store/useGroupStore";

const DetailPage = ({ onClose }: any) => {
  const { selectedGroup } = useGroupState();

  const isGroupChat = !!selectedGroup;

  return (
    <div className="p-2.5 overflow-auto flex flex-1 flex-col">
        {isGroupChat ? <GroupDetails onClose={onClose} /> : <FriendsDetails onClose={onClose} />}
    </div>
  );
};

export default DetailPage;
