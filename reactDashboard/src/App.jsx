// App.jsx mejorado con gráficos y estilos más profesionales
import Panel from "./components/Panel";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './App.css';

const API = 'http://localhost:3000';

function App() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [lastProduct, setLastProduct] = useState(null);
  const [lastUser, setLastUser] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API}/products/`).then(res => {
      setProducts(res.data);
      setLastProduct(res.data[res.data.length - 1]);
    });

    axios.get(`${API}/users/`).then(res => {
      setUsers(res.data);
      setLastUser(res.data[res.data.length - 1]);
    });

    axios.get(`${API}/category`).then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const countByCategory = () => {
    const map = {};
    products.forEach(p => {
      map[p.descripcionCategoria] = (map[p.descripcionCategoria] || 0) + 1;
    });
    return Object.entries(map).map(([categoria, cantidad]) => ({ categoria, cantidad }));
  };

  return (
    <div className="container">
      <h1 className="title">📊 Dashboard TuSuperAC</h1>

      <div className="panels">
        <Panel title="Total de productos" value={products.length} />
        <Panel title="Total de usuarios" value={users.length} />
        <Panel title="Total de categorías" value={countByCategory().length} />
      </div>

      <div className="panels">
        <Panel title="Último producto creado" value={lastProduct?.descripcion || 'Cargando...'} />
        <Panel title="Último usuario creado" value={lastUser?.nombre || 'Cargando...'} />
      </div>

      <div className="chart-section">
        <h2 className="section-title">📈 Productos por categoría</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countByCategory()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-section">
        <h2 className="section-title">📋 Listado de productos</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.descripcion}</td>
                  <td>{p.descripcionCategoria}</td>
                  <td>{p.stock_actual}</td>
                  <td>Gs. {p.precio?.toLocaleString() || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;