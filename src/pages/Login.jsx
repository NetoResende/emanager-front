import { useLoginUsuario } from "../hooks/usuarioHooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Form from "antd/es/form/Form";
import { Button, Input } from "antd";

const Login = () => {

    const navigate = useNavigate();
    const { mutateAsync: logar, isPending } = useLoginUsuario();

    //nivel 3 - avançado
    async function login(dados) {

        logar(dados, {
            onSuccess: (response) => {
                if (response.mensagem) {
                    toast(response.mensagem);
                    return;
                }
                sessionStorage.setItem("token", response.token);
                navigate("/dashboard");
            },
            onError: (response) => {
                toast(response.mensagem)
            }
        });
    }
    return (
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <Form className="w-[300px] bg-white rounded-2xl p-4! shadow-xl"
                onFinish={login}
                layout="vertical"
            >

                <h1 className="text-center text-2xl mb-6">Seja bem-vindo</h1>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Por favor insira seu email!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Senha"
                    name="senha"
                    rules={[{ required: true, message: 'Por favor insira sua senha!' }]}>
                    <Input.Password />
                </Form.Item>
                <Button htmlType="submit" type="primary" loading={isPending}>Logar</Button>
            </Form>
        </div>
    );
}

export default Login;