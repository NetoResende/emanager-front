import { Button, Divider, Drawer, Form, Input, message, Popconfirm, Select, Table } from "antd";
import { useBuscarPedido, useCriarPedido, useDeletarPedido, useEditarPedido } from "../hooks/pedidosHooks";
import { BiPencil, BiShow, BiTrash } from "react-icons/bi";
import { useContext, useState } from "react";
import { AntContext } from "../contexts/AntProvider";
import { LuSearch, LuX } from "react-icons/lu";
import { useBuscarPlataforma } from './../hooks/plataformasHooks';
import { usePesquisarJogo } from "../hooks/jogosHooks";
import { usePesquisarCliente } from "../hooks/clienteHooks";

const Pedidos = () => {

    const { data: pedidos } = useBuscarPedido();
    const { data: plataformas, isFetched: plataformasOk } = useBuscarPlataforma();

    const { mutateAsync: criarPedido } = useCriarPedido();
    const { mutateAsync: editarPedido } = useEditarPedido();
    const { mutateAsync: deletarPedido } = useDeletarPedido();
    const { mutateAsync: pesquisarJogo } = usePesquisarJogo();
    const { mutateAsync: pesquisarCliente } = usePesquisarCliente();

    const { api } = useContext(AntContext);
    const [verCriar, setVerCriar] = useState(false);
    const [verEditar, setVerEditar] = useState(false);
    const [verDetalhes, setVerDetalhes] = useState(false);
    const [pedidoSelecionado, setPedidoSelecionado] = useState({});
    const [formCriar] = Form.useForm();
    const [formEditar] = Form.useForm();
    const [formPesquisar] = Form.useForm();
    const [jogos, setJogos] = useState([])
    const [licencas, setLicencas] = useState([])
    const [clientes, setClientes] = useState([])


    function criar(dados) {
        if (jogos.length == 0) {
            api.warning({
                description: "Selecione um jogo"
            });
            return
        }
        criarPedido({ ...dados, licencas, valor: (jogos.reduce((total, jogo) => total + jogo.licencas[0].preco, 0)).toFixed(2) }, {
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

    function pesquisar(dados) {
        pesquisarJogo(dados, {
            onSuccess: (response) => {
                if (response.length == 0) {
                    api.warning({
                        description: "Jogo não encontrado"
                    })
                    formPesquisar.resetFields();
                    return;
                }
                if (!jogos.find(jogo => jogo.id == response[0].id)) {
                    setJogos([...jogos, ...response]);
                    setLicencas([...licencas, response[0].licencas.find(l => l.tipo == formPesquisar.getFieldValue("tipo")).id])
                    api.success({
                        description: "Jogo adicionado"
                    })
                } else {
                    api.success({
                        description: "Jogo já adicionado"
                    })
                }
                formPesquisar.resetFields();
            },
            onError: (response) => {
                api[response.tipo]({
                    description: response.mensagem
                })
            }
        })
    }

    function pesquisarNome(nome) {
        pesquisarCliente(nome, {
            onSuccess: (response) => {
                console.log(response);
                setClientes(response);
            },
            onError: (response) => {
                api[response.tipo]({
                    description: response.mensagem
                })
            }
        })
    }

    function removerJogo(id) {
        setJogos([...jogos.filter(jogo => jogo.id != id)]);
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
                    render={(_, pedido) => (
                        <div className="flex gap-3">
                            <BiShow
                                size={18}
                                onClick={() => {
                                    setPedidoSelecionado(pedido)
                                    setVerDetalhes(true);
                                }} />
                            <Popconfirm
                                title="Aviso:"
                                description="Deseja realmente apagar?"
                                onConfirm={() => deletar(pedido.id)}
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
                open={verDetalhes}
                onClose={() => setVerDetalhes(false)}
                title="Detalhes do pedido"
            >
                { pedidoSelecionado && (
                    <>
                        <Divider>Dados do Pedido</Divider>
                        <h3>#{pedidoSelecionado.id}</h3>
                        <h6>Data: {new Date(pedidoSelecionado.data).toLocaleDateString()}</h6>
                        <h6>Valor: R$ {Number(pedidoSelecionado.valor).toFixed(2)}</h6>
                        <Divider>Dados do Cliente</Divider>
                        <h6>Nome: {pedidoSelecionado.clientes?.nome}</h6>
                        <h6>Email: {pedidoSelecionado.clientes?.email}</h6>
                        <h6>Whatsapp: {pedidoSelecionado.clientes?.whatsapp}</h6>
                        <Divider>Licencas</Divider>
                        {
                            pedidoSelecionado.pedidos_jogos?.map(item => (
                                <div key={item.id}>
                                    <h6>Jogo: {item.licencas?.jogos?.nome}</h6>
                                    <h6>Licença:</h6>
                                    <h6>Email: {item.licencas?.contas_digitais?.email}</h6>
                                    <h6>Senha: {item.licencas?.contas_digitais?.senha}</h6>
                                    
                                </div>
                            ))
                        }
                    </>
                )}
            </Drawer>

            <Drawer
                title={"Criar"}
                open={verCriar}
                onClose={() => setVerCriar(false)}
            >
                <Form
                    layout="vertical"
                    onFinish={pesquisar}
                    form={formPesquisar}
                >
                    <div>
                        <Form.Item                   
                    >
                        <Input />
                    </Form.Item>
                    </div>
            

                    <Form.Item
                        label="Nome do jogo"
                        name={"nome"}
                        className="flex-1"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input />
                    </Form.Item>
                    <div className="flex gap-2 *:flex-1">
                        <Form.Item
                            label="Plataforma"
                            name={"plataforma"}
                            rules={[{ required: true, message: "Campo obrigatório" }]}
                        >
                            <Select
                                placeholder="Escolha a plataforma"
                                options={plataformasOk ? plataformas.map(plataforma => {
                                    return {
                                        label: plataforma.nome,
                                        value: plataforma.nome
                                    }
                                }) : []}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Tipo"
                            name={"tipo"}
                            rules={[{ required: true, message: "Campo obrigatório" }]}
                        >
                            <Select
                                placeholder="Escolha o tipo"
                                options={[
                                    {
                                        label: "Primária",
                                        value: "Primária"
                                    },
                                    {
                                        label: "Secundária",
                                        value: "Secundária"
                                    },
                                ]}
                            />
                        </Form.Item>
                    </div>
                    <Button
                        htmlType="submit"
                        className="w-full my-4"
                    >Procurar</Button>
                </Form>

                <Form
                    layout="vertical"
                    onFinish={criar}
                    form={formCriar}
                    className="mt-10"
                >

                    <Form.Item
                        label="Cliente"
                        name={"cliente_id"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            showSearch
                            filterOption={false}
                            onSearch={nome => {
                                if (nome.length > 3) {
                                    pesquisarNome(nome);
                                }
                            }}
                            options={clientes.length > 0 ? clientes.map(cliente => {
                                return {
                                    label: cliente.nome,
                                    value: cliente.id
                                }
                            }) : []}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Jogos"
                    >
                        <div>
                            {
                                jogos.length > 0 ? jogos.map(jogo => (
                                    <div key={jogo.id} className="leading-10 flex justify-between">
                                        <h6>{jogo.nome}</h6>
                                        <div className="flex gap-2 items-center">
                                            <h6>{jogo.plataformas.nome}</h6>
                                            <h6>R$ {jogo.licencas[0].preco.toFixed(2)}</h6>
                                            <LuX className="cursor-pointer" onClick={() => removerJogo(jogo.id)} />
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center text-slate-500">Nenhum jogo selecionado</div>
                                )
                            }
                        </div>
                        <div className="flex justify-between"><span>Total:</span> R$ {(jogos.reduce((total, jogo) => total + jogo.licencas[0].preco, 0)).toFixed(2)}</div>
                    </Form.Item>

                    <Button htmlType="submit" type="primary">Criar</Button>
                </Form>
            </Drawer>


        </div>
    );
}

export default Pedidos;