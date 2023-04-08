import { Group } from "@prisma/client";

export default (groupsToValidate?: Group[], userGroups?: Group[]) => {
    if (!groupsToValidate || !userGroups) return false
    // check i groupsToValidate and userGroups have atleast one group in common
    const groupIds = groupsToValidate.map(group => group.id)
    const userGroupIds = userGroups.map(group => group.id)
    const commonGroupIds = groupIds.filter(id => userGroupIds.includes(id))
    return commonGroupIds.length > 0
}