import { Bytes, log } from "@graphprotocol/graph-ts"
import {
    ProposalCreated,
} from "../generated/Contract/Contract"
import { Proposal } from "../generated/schema"
import { ADDRESS_ZERO, getVoter, getProposal } from "./HELPERS"

export function handleProposalCreated(event: ProposalCreated): void {

    let proposalId = event.params.id

    //Find or Create new Voter object
    let voter = getVoter(event.params.proposer.toHexString())

    //Create new Proposal Object
    let proposal = getProposal(proposalId.toString())

    //Add Default Values
    proposal.timestamp = event.block.timestamp
    proposal.blockNumber = event.block.number

    //Add from event to Proposal Object
    proposal.proposer = voter.id
    proposal.targets = event.params.targets as Array<Bytes>
    proposal.values = event.params.values
    proposal.signatures = event.params.signatures
    proposal.calldatas = event.params.calldatas
    proposal.startBlock = event.params.startBlock
    proposal.endBlock = event.params.endBlock
    proposal.metadata = event.params.description

    //Add Proposal to Voter's history
    let votersProposals = voter.proposalsProposed
    votersProposals.push(proposal.id)
    voter.proposalsProposed = votersProposals

    //Save Proposal
    proposal.save()
    log.info("Proposal {} has been created and Saved. ", [proposal.id])

    //Save Voter
    voter.save()
    log.info("Voter {} has proposal {} added to their history. ", [voter.id, proposal.id])

}