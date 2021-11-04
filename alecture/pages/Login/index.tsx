import useInput from "@hooks/useInput"
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from "@pages/SignUp/styles"
import fetcher from "@utils/fetcher"
import axios from "axios"
import React, { useCallback, useState } from "react"
import { Link, Redirect } from "react-router-dom"
import useSWR from "swr"

const Login = () => {
  const { data: userData, error, mutate } = useSWR("/api/users", fetcher)
  const [loginError, setLoginError] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [email, onChangeEmail] = useInput("")
  const [password, onChangePassword] = useInput("")

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (email && password) {
        setLoginError(false)
        setLoginSuccess(false)
        axios
          .post("/api/users/login", { email, password }, { withCredentials: true })
          .then(() => {
            mutate()
          })
          .catch((error) => {
            console.log(error.response?.data?.code)
            setLoginError(error.response?.data?.code === 401)
          })
      }
    },
    [email, password],
  )

  console.log(userData)
  if (userData) {
    return <Redirect to="/workspace/sleact/channel/일반" />
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
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        {!email && <Error>이메일을 입력해주세요.</Error>}
        {loginError && <Error>아이디 또는 비밀번호를 다시 확인해주세요.</Error>}
        {loginSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  )
}

export default Login
