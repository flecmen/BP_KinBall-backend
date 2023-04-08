import cron from 'node-cron';
import Logger from '../utils/logger';
import rewardService from '../services/reward-service';


/* Schedule a function to run at the start of each month
* 0 - hours
* 0 - minutes
* 1 - day of month
* * - month
* * - day of week
*/
const monthlyXpRemover = cron.schedule('0 0 1 * *', async () => {
    Logger.info('Running monthly XP remover');
    await rewardService.monthlyPunishment();
    Logger.info('Finished running monthly XP remover')
});

export default monthlyXpRemover;