import { Route, Routes } from 'react-router';

import AppLayout from '@/AppLayout';
import MapRoutes from './modules/interactive_map/MapRoutes';
import LoreRoutes from './modules/interactive_lore/LoreRoutes';

function App() {
	return (
		<Routes>
			<Route
				path="/"
				element={<AppLayout />}
			>
				{MapRoutes()}
				{LoreRoutes()}
			</Route>
		</Routes>
	);
}

export default App;
