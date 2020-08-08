import { BigInt, BigDecimal, log, Address, ByteArray } from "@graphprotocol/graph-ts"
import { Voter, Proposal } from "../generated/schema"


export function getProposal(proposalId: string): Proposal {

    //Try to load the proposal, it should not yet exist. 
    let proposal = Proposal.load(proposalId)
    if (proposal == null) {
        proposal = new Proposal(proposalId)
        log.debug('New Proposal created with ID of {}', [proposalId])

        //Add Default Values
        proposal.timestamp = BigInt.fromI32(0)
        proposal.blockNumber = BigInt.fromI32(0)
        proposal.eta = BigInt.fromI32(0)
        proposal.forVotes = BigInt.fromI32(0)
        proposal.againstVotes = BigInt.fromI32(0)
        proposal.ballots = []
        proposal.cancelled = false
        proposal.cancelledTx = Address.fromString(ADDRESS_ZERO)
        proposal.executed = false
        proposal.executionTx = Address.fromString(ADDRESS_ZERO)
        proposal.proposer = ADDRESS_ZERO
        proposal.targets = []
        proposal.values = []
        proposal.signatures = []
        proposal.calldatas = []
        proposal.startBlock = BigInt.fromI32(0)
        proposal.endBlock = BigInt.fromI32(0)
        proposal.metadata = ""
        proposal.participentCount = BigInt.fromI32(0)
    }

    return proposal as Proposal
}

export function getVoter(voterId: string): Voter {

    //VoterId should be created by the address using toHexString()
    let voter = Voter.load(voterId)

    if (voter == null) {
        voter = new Voter(voterId)
        log.debug("New Voter " + voterId + " created.", [])
        voter.proposalsProposed = []
        voter.proposalsProposedCount = BigInt.fromI32(0)
        voter.ballotsCast = []
        voter.proposalsParticipatedCount = BigInt.fromI32(0)
        voter.save()
    }

    return voter as Voter
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
