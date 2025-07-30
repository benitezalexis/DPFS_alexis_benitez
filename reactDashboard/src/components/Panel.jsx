// Panel.jsx actualizado con estilo individual y color personalizado
function Panel({ title, value, color = '#4e73df' }) {
  const panelStyle = {
    backgroundColor: color,
    color: 'white',
    borderRadius: '8px',
    padding: '1rem',
    flex: 1,
    minWidth: '200px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const titleStyle = {
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    opacity: 0.85
  };

  const valueStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
  };

  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

export default Panel;
