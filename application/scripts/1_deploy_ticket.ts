import { Deployer, DeployFunction, Network } from "@alephium/cli";
import { Settings } from "../alephium.config"; 
import { Ticket } from "../artifacts/ts"; 
import { CreditWallet } from "../artifacts/ts"; 
import { testNodeWallet } from "@alephium/web3-test"; 
import { CallContractParams, ONE_ALPH } from "@alephium/web3";

const deployContract: DeployFunction<Settings> = async (
  deployer: Deployer, // Objet déployeur pour déployer le contrat
  network: Network<Settings> // Paramètres réseau
): Promise<void> => {

  // Déploiement du contrat "Ticket"
  const result = await deployer.deployContract(Ticket, {
    initialFields: {} // Champs initiaux du contrat 
  });

  // Affiche l'ID et l'adresse du contrat déployé
  console.log('contract id ticket:' + result.contractInstance.contractId);
  console.log("contract address ticket: " + result.contractInstance.address);

  // Déploiement du contrat "CreditWallet"
  const creditWalletResult = await deployer.deployContract(CreditWallet, {
    initialFields: {} // Champs initiaux du contrat 
  });

  // Récupération de l'instance du contrat déployé
  const creditWalletContract = creditWalletResult.contractInstance;
  //console.log("credit Wallet", creditWalletContract)
  
  const signer = await testNodeWallet();
  const addresses = await signer.getAccounts(); // Récupère la liste des adresses disponibles dans le portefeuille
  const address = addresses[0]; // Utilisation de la première adresse du portefeuille

  // Affiche l'adresse du signataire (l'acheteur de ticket)
  console.log('signer address ticket: ' + addresses);

  // Montant à envoyer (en ALPH tokens, ici 1 ALPH)
  const amount = BigInt(1);

  //console.log("WALLET CREDIT =", creditWalletContract)
  console.log("Adresse du portefeuille de test :", address);
  const balance = await creditWalletContract.maps.balances.get(address.address);
  console.log("Solde du portefeuille de test avant credit :", balance);

  // Crédite le portefeuille de test avec des fonds
  await creditWalletContract.transact.creditWallet({
    signer, 
    args: { recipient: address.address, amount: BigInt(10) }, 
    attoAlphAmount: ONE_ALPH * BigInt(10) 
  });

  const newBalance = await creditWalletContract.maps.balances.get(address.address);
  console.log("Solde du portefeuille de test après credit :", newBalance);
  
  const contract = result.contractInstance;
  
  const resultat = await contract.transact.buyTicket({
    signer, 
    args: { address: address.address, amount: BigInt(1) }, // Achat d'un ticket avec le montant défini
    attoAlphAmount: ONE_ALPH 
  });

  console.log("Résultat de la transaction buyTicket :", resultat);

  console.log("Solde du portefeuille de test après buyTicket :", await creditWalletContract.maps.balances.get(address.address));

  // Affiche un message de confirmation
  console.log('Ticket acheté avec succès !');
  

}

export default deployContract;