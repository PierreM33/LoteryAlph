
import { Deployer, DeployFunction, Network } from "@alephium/cli";
import { Settings } from "../alephium.config"; 
import { Donations } from "../artifacts/ts"; 
import { testNodeWallet } from "@alephium/web3-test"; 
import { CallContractParams, ONE_ALPH } from "@alephium/web3";

const deployContract: DeployFunction<Settings> = async (
  deployer: Deployer, // Objet déployeur pour déployer le contrat
  network: Network<Settings> // Paramètres réseau
): Promise<void> => {

  // Déploiement du contrat "Donations"
  const result = await deployer.deployContract(Donations, {
    initialFields: {} // Champs initiaux du contrat (vide ici)
  });

  // Affiche l'ID et l'adresse du contrat déployé
  console.log('contract id:' + result.contractInstance.contractId);
  console.log("contract address: " + result.contractInstance.address);

  // Création d'un portefeuille de test avec un nœud de test Alephium
  const signer = await testNodeWallet();
  const addresses = await signer.getAccounts(); // Récupère la liste des adresses disponibles dans le portefeuille
  const address = addresses[0]; // Utilisation de la première adresse du portefeuille

  // Affiche l'adresse du signataire (le donateur)
  console.log('signer address: ' + addresses);

  // Montant à envoyer (en ALPH tokens, ici 10 ALPH)
  const amount = BigInt(10);

  // Préparation des paramètres pour appeler la fonction "getDonorTotal" du contrat
  const params: CallContractParams<{ donor: string }> = {
    args: { donor: address.address }, // Le donateur est l'adresse récupérée plus haut
  };

  // Récupération de l'instance du contrat déployé
  const contract = result.contractInstance;

  // Appel de la fonction "getDonorTotal" pour obtenir le solde actuel du donateur
  let getDonorTotal = await contract.view.getDonorTotal(params);

  // Affiche les informations avant la transaction
  console.log("///");
  console.log('mon adresse ===: ', address.address);
  console.log("contract balance before == ", Number(getDonorTotal.returns));

  // Transaction pour effectuer un don à l'adresse récupérée
  await contract.transact.depositTouser({
    signer, // Le signataire est le portefeuille de test
    args: { recipient: address.address, amount }, // Don à l'adresse actuelle avec le montant défini
    attoAlphAmount: ONE_ALPH * amount // Spécification du montant en attoALPH (plus petite unité d'ALPH)
  });

  // Vérification de la balance du donateur après la transaction
  getDonorTotal = await contract.view.getDonorTotal(params);

  // Affiche les informations après la transaction
  console.log("///");
  console.log('mon adresse ===: ', address.address);
  console.log("contract balance after == ", Number(getDonorTotal.returns));
}

export default deployContract;
