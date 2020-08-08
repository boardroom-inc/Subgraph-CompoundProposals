import { BigInt, Address, Bytes, log } from "@graphprotocol/graph-ts"
import {
    ProposalQueued,
} from "../generated/Contract/Contract"
import { Proposal } from "../generated/schema"


export function handleProposalQueued(event: ProposalQueued): void {

    //The Proposal should exist or we should do nothing. 
    let proposal = Proposal.load(event.params.id.toString())
    if (proposal == null) {
        log.info("Attemp to execute non-existant proposal, ID: {}.", [event.params.id.toString()])
        return
    }

    //Update new ETA for proposal
    proposal.eta = event.params.eta

    //Save Proposal
    proposal.save()
}