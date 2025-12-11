import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { useBuscarPlataforma, useCriarPlataforma, useDeletarPlataforma, useEditarPlataforma } from "../hooks/plataformasHooks";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useContext, useState } from "react";
import { AntContext } from "../contexts/AntProvider";

const Plataformas = () => {

    const { data: plataformas } = useBuscarPlataforma();
    const { mutateAsync: criarPlataforma , isPending: criarPending} = useCriarPlataforma();
    const { mutateAsync: editarPlataforma , isPending: editarPending} = useEditarPlataforma();
    const { mutateAsync: deletarPlataforma } = useDeletarPlataforma();
    const { api } = useContext(AntContext);
    const [verCriar, setVerCriar] = useState(false);
    const [verEditar, setVerEditar] = useState(false);
    const [formEditar] = Form.useForm();
    const [formCriar] = Form.useForm();

    function criar(dados) {
        criarPlataforma(dados, {
            onSuccess: (response) => {
                setVerCriar(false);
                api[response.tipo]({
                    description: response.mensagem
                })
                formCriar.resetFields()
            },
            onError: (response) => {
                api[response.tipo]({
                    description: response.mensagem
                })
            }
        })

    }

    function editar(dados) {
        editarPlataforma(dados, {
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
        deletarPlataforma(id, {
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
                <h1>Pagina de Plataformas</h1>
                <Button type="primary" onClick={() => setVerCriar(true)}>Novo plataforma</Button>
            </div>
            <Table
                dataSource={plataformas || []}
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
                    form={formCriar}
                >
                    <Form.Item
                        label={"Nome"}
                        name={"nome"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Button loading={criarPending} htmlType="submit" type="primary">Criar</Button>
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

                    <Button loading={editarPending} htmlType="submit" type="primary">Editar</Button>
                </Form>
            </Drawer>
        </div>
    );
}

export default Plataformas;