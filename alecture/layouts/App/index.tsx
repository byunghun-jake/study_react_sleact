import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import Login from "@pages/Login"
import Signup from "@pages/Signup"

const App = () => {
  return (
    <Switch>
      <Redirect path="/" to="/login" exact />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
    </Switch>
  )
}

export default App
