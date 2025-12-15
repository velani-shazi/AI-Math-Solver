import BookmarkList from "../components/Bookmarklist.js/BookmarkList"
import AccessDenied from "../components/AccessDenied/AccessDenied"

function BookmarkPage({user}) {
    if (!user) {
        return <AccessDenied />;
    }
    
    return (
        <BookmarkList user={user}/>
    )
}

export default BookmarkPage;