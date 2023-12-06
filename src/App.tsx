import { Navigate, Route, Router, Routes } from "@solidjs/router";
import { createIntegration } from "@tma.js/solid-router-integration";

import { createNavigator } from "./createNavigator";
import { InitDataPage } from "./pages/InitDataPage";
import { PokemonsPage } from "./pages/PokemonsPage";

export function App() {
  // We should create navigator to pass it to integration creation.
  const navigator = createNavigator();

  // Then, to allow this navigator update current browser history, we should attach it. Otherwise,
  // it will work in memory mode.
  void navigator()?.attach();

  return (
    <Router source={createIntegration(navigator)}>
      <Routes>
        <Route path={"/init-data"} component={InitDataPage} />
        <Route path={"/pokemons"} component={PokemonsPage} />
        <Route path={"*"} element={<Navigate href={"/init-data"} />} />
      </Routes>
    </Router>
  );
}
