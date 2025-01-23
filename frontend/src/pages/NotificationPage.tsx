import { useEffect } from "react";
import { useDetailStore } from "../store/useDetailStore";
import avatar from "../../public/avatar.png";

const NotificationPage = () => {
  const {
    getRequestList,
    requestList,
    acceptFriendRequest,
    declineFriendRequest,
    isAccepting,
    isDeclining,
    setupSocketListeners,
    wrapupSocketListeners,
  } = useDetailStore();

  useEffect(() => {
    getRequestList();
  }, [getRequestList]);
  console.log(requestList);

  useEffect(() => {
    setupSocketListeners();

    return () => {
      wrapupSocketListeners();
    };
  }, [setupSocketListeners, wrapupSocketListeners]);

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-5 min-h-0 h-[500px] overflow-y-auto">
          {requestList.length === 0 ? (
            <div className="text-center text-gray-500">
              No pending friend requests.
            </div>
          ) : (
            requestList.map((request) => (
              <div key={request._id} role="alert" className="alert bg-base-100">
                <div className="avatar">
                  <div className="size-8 rounded">
                    <img
                      src={request.profilePic || avatar}
                      alt="Tailwind-CSS-Avatar-component"
                    />
                  </div>
                </div>
                <span>
                  <strong>{request.fullName}</strong> sent you a friend request.
                </span>
                <div>
                  <button
                    className="btn btn-sm"
                    onClick={() => declineFriendRequest(request._id)}
                    disabled={isDeclining}  
                  >
                    {isDeclining ? "....." : "Decline"}
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => acceptFriendRequest(request._id)}
                    disabled={isAccepting}
                  >
                    {isAccepting ? "....." : "Accept"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
