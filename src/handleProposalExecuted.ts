import { log } from "@graphprotocol/graph-ts"
import {
    ProposalExecuted,
} from "../generated/Contract/Contract"
import { Proposal } from "../generated/schema"


export function handleProposalExecuted(event: ProposalExecuted): void {

    //The Proposal should exist or we should do nothing. 
    let proposal = Proposal.load(event.params.id.toString())
    if (proposal == null) {
        log.info("Attemp to execute non-existant proposal, ID: {}.", [event.params.id.toString()])
        return
    }

    //Update Proposal
    proposal.executed = true
    proposal.executionTx = event.transaction.hash

    proposal.save()
}
