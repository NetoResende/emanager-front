import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { useBuscarNivel, useCriarNivel, useDeletarNivel, useEditarNivel } from "../hooks/nivelHooks";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useContext, useState } from "react";
import { AntContext } from "../contexts/AntProvider";

const Niveis = () => {

    const { data: niveis } = useBuscarNivel();
    const { mutateAsync: criarNivel } = useCriarNivel();
    const { mutateAsync: editarNivel } = useEditarNivel();
    const { mutateAsync: deletarNivel } = useDeletarNivel();
    const { api } = useContext(AntContext);
    const [verCriar, setVerCriar] = useState(false);
    const [verEditar, setVerEditar] = useState(false);
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarNivel(dados, {
            onSuccess: (response) => {
                setVerCriar(false);
                api[response.tipo]({
                    description: response.mensagem
                })
            },
            onError: (response) => {
                api[response.tipo]({
                    description: response.mensagem
                })
            }
        })
    }

    function editar(dados) {
        editarNivel(dados, {
            onSuccess: (response) => {
                setVerEditar(false);
                api[response.tipo]({
                    description: response.mensagem
                })
            },
            onError: (response) => {
                api[response.tipo]({
                    description: response.mensagem
                })
            }
        })
    }

    function deletar(id) {
        deletarNivel(id, {
            onSuccess: (response) => {
                api[response.tipo]({
                    description: response.mensagem
                })
            },
            onError: (response) => {
                api[response.tipo]({
                    description: response.mensagem
                })
            }
        })
    }

    return (
        <div className="p-15">
            <div className="flex items-center justify-between mb-4">
                <h1>Pagina de Niveis</h1>
                <Button type="primary" onClick={() => setVerCriar(true)}>Novo nivel</Button>
            </div>
            <Table
                dataSource={niveis || []}
                rowKey={"id"}
            >
                <Table.Column
                    key={"id"}
                    dataIndex={"id"}
                    title={"ID"}
                    className="w-[50px]"
                />
                <Table.Column
                    key={"nome"}
                    dataIndex={"nome"}
                    title={"Nome"}
                />
                <Table.Column
                    title={"Ações"}
                    className="w-[100px]"
                    render={(_, nivel) => (
                        <div className="flex gap-3">
                            <BiPencil
                                size={18}
                                onClick={() => {
                                    formEditar.setFieldsValue({
                                        id: nivel.id,
                                        nome: nivel.nome
                                    });
                                    setVerEditar(true);
                                }}
                            />
                            <Popconfirm
                                title="Aviso:"
                                description="Deseja realmente apagar?"
                                onConfirm={() => deletar(nivel.id)}
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
                <Form
                    layout="vertical"
                    onFinish={criar}
                >
                    <Form.Item
                        label={"Nome"}
                        name={"nome"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Button htmlType="submit" type="primary">Criar</Button>
                </Form>
            </Drawer>

            <Drawer
                title={"Editar"}
                open={verEditar}
                onClose={() => setVerEditar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={editar}
                    form={formEditar}
                >
                    <Form.Item
                        hidden
                        name={"id"}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"Nome"}
                        name={"nome"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Button htmlType="submit" type="primary">Editar</Button>
                </Form>
            </Drawer>
        </div>
    );
}

export default Niveis;