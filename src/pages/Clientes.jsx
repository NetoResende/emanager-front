import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { useBuscarCliente, useCriarCliente, useDeletarCliente, useEditarCliente } from "../hooks/clienteHooks";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useContext, useState } from "react";
import { AntContext } from "../contexts/AntProvider";

const Clientes = () => {

    const { data: clientes } = useBuscarCliente();
    const { mutateAsync: criarCliente , isPending: criarPending} = useCriarCliente();
    const { mutateAsync: editarCliente, isPending: editarPending} = useEditarCliente();
    const { mutateAsync: deletarCliente } = useDeletarCliente();
    const { api } = useContext(AntContext);
    const [verCriar, setVerCriar] = useState(false);
    const [verEditar, setVerEditar] = useState(false);
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarCliente(dados, {
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
        editarCliente(dados, {
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
        deletarCliente(id, {
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
                <Button type="primary" onClick={() => setVerCriar(true)}>Novo Cliente</Button>
            </div>
            <Table
                dataSource={clientes || []}
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
                    key={"email"}
                    dataIndex={"email"}
                    title={"E-mail"}
                />
                <Table.Column
                    key={"whatsapp"}
                    dataIndex={"whatsapp"}
                    title={"WhatsApp"}
                />
                <Table.Column
                    title={"Ações"}
                    className="w-[100px]"
                    render={(_, cliente) => (
                        <div className="flex gap-3">
                            <BiPencil
                                size={18}
                                onClick={() => {
                                    formEditar.setFieldsValue({
                                ...cliente
                                    });
                                    setVerEditar(true);
                                }}
                            />
                            <Popconfirm
                                title="Aviso:"
                                description="Deseja realmente apagar?"
                                onConfirm={() => deletar(cliente.id)}
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
                    <Form.Item
                        label={"E-mail"}
                        name={"email"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"WhatsApp"}
                        name={"whatsapp"}
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
                    <Form.Item
                        label={"E-mail"}
                        name={"email"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={"WhatsApp"}
                        name={"whatsapp"}
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

export default Clientes;