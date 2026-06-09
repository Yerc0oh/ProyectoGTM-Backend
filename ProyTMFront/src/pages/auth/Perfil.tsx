import Layout from "../../components/Layout";


type Usuario = {
  username: string;
  rol: string;
};

type Props = {
  usuario: Usuario | null;
};

function Perfil({ usuario }: Props) {
  return (
    <Layout user={usuario}>
      <h2>
        Bienvenido {usuario?.username} ({usuario?.rol})
      </h2>
    </Layout>
  );
}

export default Perfil;