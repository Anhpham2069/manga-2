import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import DetailStories from "./components/Stories/DetailStories";
import UserComponent from "./components/User";
import ChapterView from "./components/Stories/ChapterView";
import AllStories from "./components/Stories/AllStories";
import FilterStories from "./components/Stories/filterStories";
import StoryListByGenre from "./components/Stories/StoryListByGenre";
import AdminLayout from "./Admin/index";
import Dasbroad from "./Admin/page/dashboard";
import StoriesAdmin from "./Admin/page/stories";
import UserManage from "./Admin/page/user";
import SearchResult from "./components/components/searchResult";
import Category from "./pages/category";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/detail/:slug" element={<DetailStories />} />
        <Route exact path="/user" element={<UserComponent />} />
        <Route exact path="/detail/:slug/view/:id" element={<ChapterView />} />
        <Route exact path="/all-stories" element={<AllStories />} />
        <Route exact path="/filter" element={<FilterStories />} />
        <Route exact path="/search/:keyword" element={<SearchResult />} />
        <Route exact path="/category/:slug" element={<Category />} />

        <Route
          path="/genres/:genre"
          element={<StoryListByGenre />}
        />

        {/* admin */}
        <Route exact path="/admin" element={<AdminLayout /> } />
        {/* <Route path='/admin/dashboard' element={<Dasbroad />} ></Route>
        <Route path='/admin/dashboard/stories' element={<StoriesAdmin />} ></Route>
      <Route path='/admin/dashboard/user' element={<UserManage />} ></Route> */}

      </Routes>
    </Router>
  );
}

export default App;
