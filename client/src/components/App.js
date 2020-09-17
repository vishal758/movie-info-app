import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import MovieDetailPage from './views/MovieDetailPage/MovieDetailPage'
import FavouritePage from './views/FavouritePage/FavouritePage'
import TvLandingPage from './views/TV/TvLandingPage'
import TvDetailPage from './views/TV/TvInfo/TvDetailPage'

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/tv/sortBy/:type" component={Auth(TvLandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/sortBy/:type" component={Auth(LandingPage, null)} />
          {/* <Route exact path="/movie/:movieId/recommendations" component={Auth(MovieDetailPage, null)} /> */}
          <Route exact path="/movie/:movieId" component={Auth(MovieDetailPage, null)} />
          <Route exact path="/tv/:serieId" component={Auth(TvDetailPage, null)} />

          <Route exact path="/favourite" component={Auth(FavouritePage, true)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
