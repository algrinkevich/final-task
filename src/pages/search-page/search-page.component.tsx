import { useSelector } from "react-redux";

import { selectCurrentUser } from "../../store/user/user.selector";
import { signOutUserAsync } from "../../utils/firebase/firebase.utils";

import "./search-page.style.scss";

const SearchPage = () => {
  const currentUser = useSelector(selectCurrentUser);

  console.log("User", currentUser?.email);

  return (
    <div>
      <span>{"Search Page"}</span>
      <br />
      {currentUser ? (
        <a onClick={signOutUserAsync}>{"Sign out"}</a>
      ) : (
        <h1>{"No user"}</h1>
      )}
    </div>
  );
};

export default SearchPage;
