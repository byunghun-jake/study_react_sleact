import loadable from "@loadable/component"
import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
// import Login from "@pages/Login"
const Login = loadable(() => import("@pages/Login"))
// import Signup from "@pages/Signup"
const SignUp = loadable(() => import("@pages/SignUp"))
const Workspace = loadable(() => import("@layouts/Workspace"))

const App = () => {
  return (
    <Switch>
      <Redirect path="/" to="/login" exact />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={Workspace} />
    </Switch>
  )
}

export default App
