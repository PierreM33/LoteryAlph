import { NetworkId } from '@alephium/web3'

export interface TokenFaucetConfig {
  network: NetworkId
  groupIndex: number
}

function getNetwork(): NetworkId {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'devnet') as NetworkId
  return network
}

const tokenFaucetConfig: TokenFaucetConfig = {
  network: getNetwork(),
  groupIndex: 0, // ou une autre valeur par défaut
}

export { tokenFaucetConfig }
