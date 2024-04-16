import * as react from 'react'
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ConnectNostr } from './stories/ConnectNostr';
import { WelcomePage } from './stories/WelcomePage';
import { CouponAccountSetup } from './stories/CouponAccountSetup';

import { RenderModals } from './stories/RenderModals';
// import './App.css'

function App() {
  const [selectedModal, setSelectedModal] = react.useState("NONE")
  const [nip07Status, setNip07Status] = react.useState(false)

  react.useEffect(() =>{
    if(Object.keys(window).includes("nostr")){
      setNip07Status(true)
    }
  }, [])



  const router = createBrowserRouter([
    {
      path: "/",
      // element: <h1>HOME PAGE</h1>,
      element: <WelcomePage></WelcomePage>,
    },
    {
      path: "/dd",
      element: 
        <div>
          <ConnectNostr
            nip07Status={nip07Status}
            setSelectedModal={setSelectedModal}
          >
          </ConnectNostr>
        </div>
    },
    {
      path: "/coupon",
      element: 
        <CouponAccountSetup
          setSelectedModal={setSelectedModal}
          >
        </CouponAccountSetup>,
    },
    {
      path: "/profile",
      element: <div>User can set NIP05 Relays, Rotate Nostr Key, and set Web Key Directory Here</div>,
    },
    {
      path: "/login",
      element: <div>
        <ConnectNostr
          nip07Status={nip07Status}>
        </ConnectNostr>
      </div>,
    },
  ]);
  return (
    <>  
        <RenderModals
          modalSelected={selectedModal}
          setSelectedModal={setSelectedModal}
        >  </RenderModals>
        <RouterProvider router={router} />
    </>
  );
}

export default App
