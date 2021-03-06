import React, { useCallback, useState } from "react"
import { Header, Form, Label, Input, Error, Success, Button, LinkContainer } from "@pages/SignUp/styles"
import { Link, Redirect } from "react-router-dom"
import useInput from "@hooks/useInput"
import axios from "axios"
import useSWR from "swr"
import fetcher from "@utils/fetcher"

const SignUp = () => {
  const { data: userData } = useSWR("/api/users", fetcher)
  const [mismatchError, setMismatchError] = useState(false)
  const [signUpError, setSignUpError] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [email, onChangeEmail] = useInput("")
  const [nickname, onChangeNickname, setNickname] = useInput("")
  const [password, _1, setPassword] = useInput("")
  const [confirmPassword, _2, setConfirmPassword] = useInput("")

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value)
      setMismatchError(confirmPassword !== e.target.value)
      console.log(e.target.value)
    },
    [confirmPassword, setPassword],
  )
  const onChangeConfirmPassword = useCallback(
    (e) => {
      setConfirmPassword(e.target.value)
      setMismatchError(password !== e.target.value)
      console.log(password, e.target.value)
    },
    [password, setConfirmPassword],
  )

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!nickname.trim()) {
        setNickname((o) => o.trim())
        return
      }
      if (!mismatchError) {
        setSignUpError(false)
        setSignUpSuccess(false)
        axios
          .post("/api/users", { email, nickname, password })
          .then(() => {
            setSignUpSuccess(true)
          })
          .catch((error) => {
            console.log(error.response)
            setSignUpError(error.response?.data)
          })
      }
    },
    [email, nickname, password, confirmPassword],
  )

  console.log(userData)
  if (userData) {
    return <Redirect to="/workspace/sleact" />
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>????????? ??????</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>?????????</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>????????????</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>???????????? ??????</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
            />
          </div>
          {mismatchError && <Error>??????????????? ???????????? ????????????.</Error>}
          {!nickname && <Error>???????????? ??????????????????.</Error>}
          {signUpError && <Error>?????? ????????? ??????????????????.</Error>}
          {signUpSuccess && <Success>???????????????????????????! ?????????????????????.</Success>}
        </Label>
        <Button type="submit">????????????</Button>
      </Form>
      <LinkContainer>
        ?????? ???????????????????&nbsp;
        <Link to="/login">????????? ????????????</Link>
      </LinkContainer>
    </div>
  )
}

export default SignUp
