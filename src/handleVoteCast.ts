import { BigInt, log } from "@graphprotocol/graph-ts"
import {
    VoteCast, CastVoteCall__Outputs
} from "../generated/Contract/Contract"
import { Proposal, Ballot } from "../generated/schema"
import { getVoter } from "./HELPERS"


export function handleVoteCast(event: VoteCast): void {

    //Get support and votes
    let voterSupportsProposal = event.params.support
    let votesCast = event.params.votes

    //The Proposal should exist or we should do nothing.
    //This is just a sanity check, the contract should prevent this.
    let proposal = Proposal.load(event.params.proposalId.toString())
    if (proposal == null) {
        log.info("Attemp to execute non-existant proposal, ID: {}.", [event.params.proposalId.toString()])
        return
    }

    //Get the Voter
    let voter = getVoter(event.params.voter.toHexString())

    //Create a Ballot
    let ballot = new Ballot(event.transaction.hash.toHexString())
    log.debug("New Ballot created for voter: {} ", [voter.id])
    ballot.voter = voter.id
    ballot.support = voterSupportsProposal
    ballot.votesCast = votesCast
    ballot.timestamp = event.block.timestamp
    ballot.blockNumber = event.block.number
    ballot.proposal = proposal.id

    //Add Ballot to Proposal
    let proposalBallots = proposal.ballots
    proposalBallots.push(ballot.id)
    proposal.ballots = proposalBallots

    //Add this proposal to the list voter has participated in. 
    let votesParticipated = voter.ballotsCast
    votesParticipated.push(ballot.id)
    voter.ballotsCast = votesParticipated

    //Add this participation to the Voters participation count
    voter.proposalsParticipatedCount = voter.proposalsParticipatedCount.plus(BigInt.fromI32(1))

    //Add to count of participation. 
    //TODO: Check if we don't need to screen for double votes
    proposal.participentCount = proposal.participentCount.plus(BigInt.fromI32(1))

    //Add Number of Votes to Proposal
    if (voterSupportsProposal) {
        proposal.forVotes = proposal.forVotes.plus(votesCast)
    } else {
        proposal.againstVotes = proposal.againstVotes.plus(votesCast)
    }

    //TODO: Update the Voters Participation Score

    //Save
    voter.save()
    proposal.save()
    ballot.save()

}