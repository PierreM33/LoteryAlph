import { useEffect, useState } from 'react'
import { useWallet } from '@alephium/web3-react'
import { Donations } from '../../artifacts/ts'

const Donation = () => {
    const { signer } = useWallet()
    const [amount, setAmount] = useState('0')
    const [recipient, setRecipient] = useState('')
    const [contractInstance, setContractInstance] = useState<any>(null)
    const [state, setState] = useState<any>(true)

    const contractId = "51bda4974a767dba4950e48fc3658f6494f2313a90c6b9e4749a85e4cc245f00"

    const handleDonate = async () => {
        console.log("Signer: ", signer)
        console.log("ContractInstance: ", contractInstance)
        if (signer && contractInstance) {
            setState(!state)
            try {
                const donationAmount = BigInt(amount)
                await contractInstance.transact.depositTouser({
                    signer,
                    args: { recipient, amount: donationAmount },
                    attoAlphAmount: donationAmount
                })
                console.log('Donation successful')
            } catch (error) {
                console.error('Donation failed', error)
            }
        }
    }

    const loadContract = async () => {
        if (!contractInstance && signer) {
            console.log("Loading contract...")
            try {
                const contract = await Donations.at(contractId)
                console.log("Contract loaded:", contract)
                setContractInstance(contract)
            } catch (error) {
                console.error('Failed to load contract:', error)
            }
        }
    }

    useEffect(() => {
        if (signer) {
            loadContract()
        }
    }, [signer])

    return (
        <div>
            <h2 style={{color: state ? "red" : "green"}}>Make a Donation</h2>
            <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleDonate}>Donate</button>
        </div>
    )
}

export default Donation
