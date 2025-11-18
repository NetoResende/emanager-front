import { Button, Drawer, Form, Input, Popconfirm, Select, Table } from "antd";
import {
    useBuscarUsuario,
    useCriarUsuario,
    useDeletarUsuario,
    useEditarUsuario,
} from "../hooks/usuarioHooks";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useContext, useRef, useState } from "react";
import { AntContext } from "../contexts/AntProvider";
import { useBuscarNivel } from "../hooks/nivelHooks";

const Usuarios = () => {
    const { data: usuarios } = useBuscarUsuario();
    const { data: niveis, isFetched: niveisCarregados } = useBuscarNivel();
    const { mutateAsync: criarUsuario } = useCriarUsuario();
    const { mutateAsync: editarUsuario } = useEditarUsuario();
    const { mutateAsync: deletarUsuario } = useDeletarUsuario();
    const { api } = useContext(AntContext);
    const [verCriar, setVerCriar] = useState(false);
    const [verEditar, setVerEditar] = useState(false);
    const [formEditar] = Form.useForm();
    const [formCriar] = Form.useForm();
    const formRef = useRef(null);
    
    

    function criar(dados) {
        criarUsuario(dados, {
            onSuccess: (response) => {
                setVerCriar(false);
                api[response.tipo]({
                    description: response.mensagem,
                });
                formCriar.resetFields()
            },
            onError: (response) => {
                api[response.tipo]({
                    description: response.mensagem,
                });
            },
        });
    }

    function editar(dados) {
        editarUsuario(dados, {
            onSuccess: (response) => {
                setVerEditar(false);
                api[response.tipo]({
                    description: response.mensagem,
                });
            },
            onError: (response) => {
                api[response.tipo]({
                    description: response.mensagem,
                });
            },
        });
    }

    function deletar(id) {
        deletarUsuario(id, {
            onSuccess: (response) => {
                api[response.tipo]({
                    description: response.mensagem,
                });
            },
            onError: (response) => {
                api[response.tipo]({
                    description: response.mensagem,
                });
            },
        });
    }

    return (
        <div className="p-15">
            <div className="flex items-center justify-between mb-4">
                <h1>Pagina Usuarios</h1>
                <Button type="primary" onClick={() => setVerCriar(true)}>
                    Novo usuario
                </Button>
            </div>
            <Table dataSource={usuarios || []} rowKey={"id"}>
                <Table.Column
                    key={"id"}
                    dataIndex={"id"}
                    title={"ID"}
                    className="w-[50px]"
                />
                <Table.Column key={"nome"} dataIndex={"nome"} title={"Nome"} />
                <Table.Column
                    title={"Ações"}
                    className="w-[100px]"
                    render={(_, usuario) => (
                        <div className="flex gap-3">
                            <BiPencil
                                size={18}
                                onClick={() => {
                                    formEditar.setFieldsValue({
                                        ...usuario
                                    });
                                    setVerEditar(true);
                                }}
                            />
                            <Popconfirm
                                title="Aviso:"
                                description="Deseja realmente apagar?"
                                onConfirm={() => deletar(usuario.id)}
                                okText="Sim"
                                cancelText="Não"
                            >
                                <BiTrash size={18} />
                            </Popconfirm>
                        </div>
                    )}
                />
            </Table>

            <Drawer
                title={"Criar"}
                open={verCriar}
                onClose={() => setVerCriar(false)}
            >
                <Form layout="vertical" onFinish={criar} form = {formCriar}>
                    <Form.Item
                        label={"Nome"}
                        name={"nome"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"Email"}
                        name={"email"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={"Senha"}
                        name={"senha"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label={"Nivel"}
                        name={"nivel_id"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            options={niveisCarregados? niveis.map(nivel =>{
                                return {
                                    value: nivel.id,
                                    label: nivel.nome
                                }
                            }):[]
                
                            }
                        />
                    </Form.Item>

                    <Button htmlType="submit" type="primary">
                        Criar
                    </Button>
                </Form>
            </Drawer>

            <Drawer
                title={"Editar"}
                open={verEditar}
                onClose={() => setVerEditar(false)}
            >
                <Form layout="vertical" onFinish={editar} form={formEditar}>
                    <Form.Item hidden name={"id"}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"Nome"}
                        name={"nome"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"Email"}
                        name={"email"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={"Senha"}
                        name={"senha"}
                        
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label={"Nivel"}
                        name={"nivel_id"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            options={niveisCarregados? niveis.map(nivel =>{
                                return {
                                    value: nivel.id,
                                    label: nivel.nome
                                }
                            }):[]
                
                            }
                        />
                    </Form.Item>

                    <Button htmlType="submit" type="primary">
                        Editar
                    </Button>
                </Form>
            </Drawer>
        </div>
    );
};

export default Usuarios;
