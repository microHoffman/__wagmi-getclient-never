import { createConfig, getConnectorClient, http } from "@wagmi/core";
import { mainnet, polygon } from "viem/chains";
import { getAccount, getEnsName } from '@wagmi/core'

const config2 = createConfig({
    chains: [mainnet, polygon],
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http()
    }
})

const firstNever = config2.getClient({ chainId: 1 })

const secondNeverFn = async () => {
    const secondNever = await getConnectorClient(config2)
}

const { address } = getAccount(config2)
const ensName = await getEnsName(config2, { address })