import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import {createClient} from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/SendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3YW9rcGZ6dnZvY2VrZHVkdnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUxNDQyOTIsImV4cCI6MjAxMDcyMDI5Mn0.uagkx8Me5Ta1xotGmSwOVo0TKhj1IuhltDwQqPJqqRA';
const SUPABASE_URL = 'https://bwaokpfzvvocekdudvwz.supabase.co';
const supabaseCliente = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function escutaMsgemTempoReal(adicionaMsg){
    return supabaseCliente
        .channel('custom-insert-channel')
        //.from('mensagens')
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'mensagens' },(resposta)=>{adicionaMsg(resposta.new)})
        .subscribe()
}

export default function PaginaDoChat(){
    const [mensagem, setMensagem] = useState("")
    const [listaMensagem, setListaMensagem] = useState([])
    const rota = useRouter()
    const usuarioLogado = rota.query.username;

    useEffect(()=>{
        supabaseCliente
        .from('mensagens')
        .select('*')
        .order('id', {ascending: false})
        .then(({data})=>{
            setListaMensagem(data)
        })
        const subscription = escutaMsgemTempoReal((novaMensagem) => {
            console.log('Nova mensagem:', novaMensagem);
            console.log('listaDeMensagens:', listaMensagem);
            setListaMensagem((valorAtualDaLista) => {
              console.log('valorAtualDaLista:', valorAtualDaLista);
              return [
                novaMensagem,
                ...valorAtualDaLista,
              ]
            });
          });
      
          return () => {
            subscription.unsubscribe();
          }
    }, [])

    function handleNovaMensagem(novaMensagem){
        const mensagem = {
            texto: novaMensagem,
            de: usuarioLogado
        }
        supabaseCliente
            .from('mensagens')
            .insert([mensagem])
            .then(({data})=>{
                console.log(data)
            })
        setMensagem("")
    }
    return(
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaMensagem}/>

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                        value={mensagem}
                        onChange={(event)=> setMensagem(event.target.value)}
                        onKeyPress={(e)=>{
                            if (e.key === "Enter") {
                                e.preventDefault()
                                handleNovaMensagem(mensagem)
                            }
                        }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker onStickerClick={(sticker)=> {
                            handleNovaMensagem(':sticker:' + sticker)
                        }}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowX: "hidden",
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                display: 'flex'
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:') ? 
                        <Image src={mensagem.texto.replace(':sticker:', '')}/>: mensagem.texto}
                    </Text>
                );
            })}
        </Box>
    )
        }