/*
import { coinbaseWallet, injected, safe, walletConnect } from '@wagmi/connectors'
import { createConfig, fallback, http, unstable_connector as unstableConnector } from '@wagmi/core'
import { mainnet, polygon } from '@wagmi/core/chains'

// @see https://stackoverflow.com/a/76176570
export const typeSafeObjectFromEntries = <
  const T extends ReadonlyArray<readonly [PropertyKey, unknown]>
>(
  entries: T
): { [K in T[number] as K[0]]: K[1] } => {
  return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
};

const CHAINS_CONSTANTS: any = {}


// TODO use any types from here? https://github.com/sindresorhus/type-fest

/*
type CreateWagmiConfigParameters<chains extends readonly [Chain, ...Chain[]]> = {
  supportedChains: chains
  chainToConnect: chains[number]['id']
}
*/

/*
type CreateWagmiConfigParameters = {
  supportedChains: [typeof mainnet, typeof polygon]
  chainToConnect: typeof mainnet.id | typeof polygon.id
}

// TODO do we need to pass also chainToConnect ?
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
//export function createWagmiConfig<
//  const chains extends readonly [Chain, ...Chain[]],
//  transports extends Record<chains[number]['id'], Transport>,
// >({ supportedChains, chainToConnect }: CreateWagmiConfigParameters<chains>) {
 

export function createWagmiConfig({ supportedChains, chainToConnect }: CreateWagmiConfigParameters) {
  // TODO does this need to be inside this function? or can we move it top level?
  const metadata = {
    name: 'PWN',
    description: 'PWN is a hub for peer-to-peer (P2P) loans backed by digital assets. Use your tokens or NFTs as collateral.',
    url: 'asdasd',
    icons: [],
  }

  const createTransports = () => {
    return typeSafeObjectFromEntries(
      supportedChains.map(supportedChain => [
        supportedChain.id,
        fallback([
          // websockets is not used, as we do not listen to any contract events permanently and there are some
          // issues with websockets reconnection as well https://github.com/wevm/viem/issues/877
          http(CHAINS_CONSTANTS[supportedChain.id].nodeProvider.httpNodeUrl, {
            // TODO what batch wait time to set? by default is batch.wait 0 (zero delay)
            batch: true,
            ...(CHAINS_CONSTANTS[supportedChain.id].nodeProvider.bearerAuthToken && {
              fetchOptions: {
                headers: {
                  Authorization: `Bearer ${CHAINS_CONSTANTS[supportedChain.id].nodeProvider.bearerAuthToken}`,
                },
              },
            }),
          }),
          /*
            @see https://wagmi.sh/core/api/transports/unstable_connector
            It is highly recommended to use the unstable_connector Transport inside of a fallback Transport.
            This ensures that if the Connector request fails, the Transport will fall back to a different Transport in the fallback set.
            Some common cases for a Connector request to fail are:
            - Chain ID mismatches,
            - Connector RPC not supporting the requested method and/or only supporting a subset of methods for connected accounts,
            - Rate-limiting of Connector RPC.
          */
/*
          unstableConnector(injected),
          // TODO should we have also unstable_connector where we pass the other supported connectors?
          ...(CHAINS_CONSTANTS[supportedChain.id].pwnNode
            ? [
              http(CHAINS_CONSTANTS[supportedChain.id].pwnNode.httpNodeUrl, {
                // TODO use same config as for above http ?
                batch: true,
                // TODO also set key?
                name: 'PWN Node',
              }),
            ]
            : []),
        ], { rank: true }) // @see https://viem.sh/docs/clients/transports/fallback.html
      ])
    )
  }

  return createConfig({
    // TODO should we also we adjust our typings?
    chains: supportedChains,
    connectors: [
      // note MetaMask connector is intentionally disabled, for reasoning see here:
      //    https://wagmi.sh/core/api/connectors/metaMask
      // note: there is also `mock` connector that we might want to use for some tests in the future
      //    https://wagmi.sh/core/api/connectors/mock
      coinbaseWallet({
        appName: metadata.name,
        darkMode: true,
        // TODO:
        //    1) do we need to use this chainId parameter?
        //    2) do we need to reinitialize this when a connectedChain changes (i guess before connecting a wallet)
        chainId: chainToConnect,
      }),
      // TODO what about the `unstable_shimAsyncInject` injected parameter?
      // TODO is it needed to do anything else to add EIP6963 support? previously there was EIP6963Connector from web3modal
      injected(),
      safe({
        allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /cronos-safe.org$/, /multisig.mantle.xyz$/, /multisig.bnbchain.org/],
        // TODO what about debug parameter
        // TODO what about shimDisconnect parameter that is by default off?
      }),
      walletConnect({
        projectId: '0xasda',
        // TODO what is disableProviderPing?
        metadata,
        qrModalOptions: {
          themeMode: 'dark',
        },
      }),
    ],
    multiInjectedProviderDiscovery: true, // EIP6963
    // TODO look at the `batch` parameter
    //  https://wagmi.sh/core/api/createConfig#batch
    // TODO do we need to care about cacheTime & pollingInterval parameters?
    transports: createTransports(),
  })
}

const config = createWagmiConfig({
    supportedChains: [mainnet, polygon],
    chainToConnect: 1
})

config.getClient()

const config2 = createConfig({
  chains: [mainnet, polygon],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http()
  }
})
config2.getClient({ chainId })


export type PwnWagmiConfig = ReturnType<typeof createWagmiConfig>

// TODO remove, for debugging only
export type PwnWagmiConfigChains = PwnWagmiConfig['chains']
export type PwnWagmiConfigChain = PwnWagmiConfigChains[number]

export type PwnWagmiConfigChainId = PwnWagmiConfigChains[number]['id']

export type PwnWagmiConfigTransports = PwnWagmiConfig['_internal']['transports']

export type Asd = ReturnType<PwnWagmiConfig['getClient']>

export type AAA = PwnWagmiConfig['getClient']

export type DoesNotWork = Extract<PwnWagmiConfig['chains'][number], { id: number }>

export type Exx<chainId extends PwnWagmiConfig['chains'][number]['id']> = Extract<PwnWagmiConfig['chains'][number], { id: chainId }>

export type ExxM = Exx<1>

export type AJSNDKJANSDJA<chainId extends PwnWagmiConfig['chains'][number]['id']> = Extract<PwnWagmiConfigChains[number], { id: chainId }>
export type AJSNDKJANSDAJA<chainId extends PwnWagmiConfig['chains'][number]['id']> = PwnWagmiConfigTransports[chainId]

/*
getClient<chainId extends chains[number]['id']>(parameters?: {
  chainId?: chainId | chains[number]['id'] | undefined
}): Client<transports[chainId], Extract<chains[number], { id: chainId }>>
*/

// TODO check if something like https://www.reversemirage.com/ would be useful for us, btw it's built on viem

// TODO maybe change the structure of files to something like useWagmi, useWallet?