import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './components/Home.jsx'
import About from './components/About.jsx'
import {divider, NextUIProvider} from '@nextui-org/react'
import Chatbot from './components/Chatbot.jsx'
import CalendarComponent from './components/Calendar.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
import CommunityList from './components/CommunityList.jsx'
import ForumPage from './components/ForumPage.jsx' 
import DoubtPage from './components/DoubtPage.jsx'
import ReplyPage from './components/ReplyPage.jsx'
import MentorDetail from './components/MentorDetails.jsx'
import Mentorship from './components/mentorship.jsx'
import Questions from './components/Questions.jsx'
import Roadmap from './components/Roadmap.jsx'
import StudyRoom from './components/StudyRoom.jsx'
import Account from './components/Account.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/login' element={<Login/>}/> 
    <Route path='/register' element={<Register/>}/>
    <Route path='/questions' element={<Questions/>}/>
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<Home/>}/>
      <Route path='chatbot' element={<Chatbot/>}/>
      <Route path='calendar' element={<div style={{height: "100vh", width:"80%", marginLeft:"20%", padding:"1.25rem", background:"white"}}><CalendarComponent/></div>}/>
      <Route path='roadmap' element={<Roadmap/>}/>
      <Route path='studyroom' element={<StudyRoom/>}/>
      <Route path='mentorship' element={<div style={{height: "100vh", width:"80%", marginLeft:"20%", padding:"1.25rem", background:"white"}}><Mentorship/></div>}/>
      <Route path='mentorship/:id' element={<div style={{height: "100vh", width:"80%", marginLeft:"20%", padding:"1.25rem", background:"white"}}><MentorDetail/></div>}/>
      <Route path='mentorship' element={<div style={{height: "100vh", width:"80%", marginLeft:"20%", padding:"1.25rem", background:"white"}}><Mentorship/></div>}/>
      <Route path='account' element={<div style={{height: "100vh", width:"80%", marginLeft:"20%", padding:"1.25rem", background:"#"}}><Account/></div>}/>

      <Route path='forum'>
          <Route index element={<CommunityList />} />
          <Route path=':communityId'>
            <Route index element={<ForumPage />} />
            <Route path=':doubtId'>
              <Route index element={<DoubtPage />} />
              <Route path=':replyId' element={<ReplyPage />} />
            </Route>
          </Route>
        </Route>
    </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router}/>
    </NextUIProvider>
  </React.StrictMode>,
)
