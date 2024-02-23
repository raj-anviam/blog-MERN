import logo from './logo.svg';
import './App.css';
import {Route, Routes} from 'react-router-dom'
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPostPage from './pages/EditPostPage';
import { Provider } from 'react-redux';
import { store } from './app/store';

function App() {  
  return (
    <UserContextProvider>

      <Provider store={store} >

        <Routes>

          <Route path='/' element={<Layout />}>

            <Route index element={<IndexPage />}/>
            <Route path={'/login'} element={<LoginPage />} />
            <Route path={'/register'} element={<RegisterPage />} />
            <Route path={'/create'} element={<CreatePost />} />
            <Route path='/post/:id' element={<PostPage />} />
            <Route path='/edit/:id' element={<EditPostPage />} />

          </Route>
          
        </Routes> 
        
      </Provider>
      
    </UserContextProvider>
  );
}

export default App;
