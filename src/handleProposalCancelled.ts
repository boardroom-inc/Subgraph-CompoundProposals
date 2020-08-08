import { log } from "@graphprotocol/graph-ts"
import {
  ProposalCanceled,
} from "../generated/Contract/Contract"
import { Proposal } from "../generated/schema"

export function handleProposalCanceled(event: ProposalCanceled): void {

  //The Proposal should exist or we should do nothing. 
  let proposal = Proposal.load(event.params.id.toString())
  if (proposal == null) {
    log.info("Attemp to execute non-existant proposal, ID: {}.", [event.params.id.toString()])
    return
  }

  //Update Proposal
  proposal.cancelled = true
  proposal.cancelledTx = event.transaction.hash

  proposal.save()
}