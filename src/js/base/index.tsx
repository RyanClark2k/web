import * as React from "react"
import * as ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Container } from "./ui/layout"
import { Nav, Navbar } from "./ui/navigation"
import { useCallback, useDispatch, Provider, createStore, useSelector } from "./react_base"
import Home from "./home"
import About from "./about"
import "./styles.scss"
import { Button } from "./ui/inputs"
import { apiCall as loginCall, API_ARGS as LOGIN_ARGS } from "../api/login"
import { rootReducer, AppState } from "./reducers"
import setData from "./actions"

interface BaseProps {
  children: React.ReactElement | React.ReactElement[]
}

function Base(props: BaseProps) {
  const { children } = props

  const dispatch = useDispatch()
  const loggedIn = useSelector((state: AppState) => state.loggedIn)

  const onLogin = useCallback(() => {
    loginCall(
      LOGIN_ARGS,
      () => {
        dispatch(
          setData({
            loggedIn: true,
          }),
        )
      },
      () => {},
    )
  }, [dispatch])

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Hello World!</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            {loggedIn ? (
              <Button className="login" onClick={onLogin}>
                Log Out
              </Button>
            ) : (
              <Button className="login" onClick={onLogin}>
                Log In
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <div className="content-base">{children}</div>
      </Container>
    </>
  )
}

const ROUTES = {
  "/about": About,
}

const store = createStore(rootReducer)

ReactDOM.render(
  <Provider store={store}>
    <Base>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} index />
          {Object.keys(ROUTES).map((route) => {
            const Component = ROUTES[route]
            return <Route path={route} key={route} element={<Component />} />
          })}
        </Routes>
      </Router>
    </Base>
  </Provider>,
  document.getElementById("root"),
)
