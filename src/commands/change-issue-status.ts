import * as vscode from 'vscode';
import { IssueItem } from '../explorer/item/issue-item';
import { logger, selectValues, store } from '../services';

export default async function changeIssueStatusCommand(issueItem: IssueItem): Promise<void> {
  try {
    if (issueItem && issueItem.issue && store.canExecuteJiraAPI()) {
      let issue = issueItem.issue;
      // verify if it's the current working issue
      if (!store.isWorkingIssue(issue.key)) {
        const newTransitionId = await selectValues.selectTransition(issue.key);
        if (newTransitionId) {
          // call Jira API
          const result = await store.state.jira.setTransition({
            issueKey: issue.key,
            transition: {
              transition: {
                id: newTransitionId
              }
            }
          });
          await vscode.commands.executeCommand('jira-plugin.refresh');
        }
      }
    } else {
      if (store.canExecuteJiraAPI()) {
        logger.printErrorMessageInOutputAndShowAlert('Use this command from Jira Plugin EXPLORER');
      }
    }
  } catch (err) {
    logger.printErrorMessageInOutputAndShowAlert(err);
  }
}
