import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { useBuscarPedido, useCriarPedido, useDeletarPedido, useEditarPedido } from "../hooks/pedidosHooks";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useContext, useState } from "react";
import { AntContext } from "../contexts/AntProvider";

const Pedidos = () => {

    const { data: pedidos } = useBuscarPedido();
    const { mutateAsync: criarPedido } = useCriarPedido();
    const { mutateAsync: editarPedido } = useEditarPedido();
    const { mutateAsync: deletarPedido } = useDeletarPedido();
    const { api } = useContext(AntContext);
    const [verCriar, setVerCriar] = useState(false);
    const [verEditar, setVerEditar] = useState(false);
    const [formEditar] = Form.useForm();

    function criar(dados) {
        criarPedido(dados, {
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



    function deletar(id) {
        deletarPedido(id, {
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
                <h1>Pagina de Pedidos</h1>
                <Button type="primary" onClick={() => setVerCriar(true)}>Novo Pedido</Button>
            </div>
            <Table
                dataSource={pedidos || []}
                rowKey={"id"}
            >
                <Table.Column
                    key={"id"}
                    dataIndex={"id"}
                    title={"ID"}
                    className="w-[50px]"
                />
                <Table.Column
                    title={"cliente"}
                    render={(_, pedido) => pedido.clientes.nome}
                />
                <Table.Column
                    title={"data"}
                    render={(_, pedido) => new Date(pedido.data).toLocaleDateString()}
                />
                <Table.Column
                    key={"status"}
                    dataIndex={"status"}
                    title={"status"}
                    className="w-[100px]"
                />
                <Table.Column
                   render={(_, pedido) => (<div>R$ {Number(pedido.valor).toFixed(2)}</div>)}
                    title={"valor"}
                    className="w-[100px]"
                />
                <Table.Column
                    title={"Ações"}
                    className="w-[100px]"
                    render={(_, nivel) => (
                        <div className="flex gap-3">

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
                    <div>
                        <Form.Item                   
                    >
                        <Input />
                    </Form.Item>
                    </div>
            

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


        </div>
    );
}

export default Pedidos;