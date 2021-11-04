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
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={confirmPassword}
              onChange={onChangeConfirmPassword}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>이미 가입된 이메일입니다.</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  )
}

export default SignUp