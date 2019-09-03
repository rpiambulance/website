<?php
require_once 'vendor/autoload.php';
require_once '.functions.php';

putenv('GOOGLE_APPLICATION_CREDENTIALS=gcal_creds.json');

Class GoogleCalendar {

    private $service;
    private $calendar_id = 'rpiambulance.com_uuc6tmlmf4ct8qeps19oj1i69g@group.calendar.google.com';

    function __construct() {
      $client = new Google_Client();
      $client->useApplicationDefaultCredentials();
      $client->setApplicationName('RPIA Calendar');
      $client->addScope(Google_Service_Calendar::CALENDAR);
      $client->addScope(Google_Service_Calendar::CALENDAR_READONLY);
      $this->service = new Google_Service_Calendar($client);
    }
    
    function createEvent($name, $start, $end, $loc, $id, $game) {
      $event = new Google_Service_Calendar_Event(array(
          'summary' => $name,
          'location' => $loc,
          'start' => array(
              'dateTime' => $start,
              'timeZone' => 'America/New_York',
            ),
            'end' => array(
              'dateTime' => $end,
              'timeZone' => 'America/New_York',
            ),
      ));
      $event = $this->service->events->insert($this->calendar_id, $event);
      $eventId = $event->getId();
      $connection = openDatabaseConnection();
      if ($game) {
        $stmt = $connection->prepare('UPDATE games SET gcalEventId=:eventId WHERE id=:id');
      } else {
        $stmt = $connection->prepare('UPDATE events SET gcalEventId=:eventId WHERE id=:id');
      }
      $stmt->bindParam(':eventId', $eventId);
      $stmt->bindParam(':id', $id);
      $stmt->execute();
      $connection = null;
      return $event;
    }

    function deleteEvent($id, $game) {
      $eventId = $this->getGcalEventId($id, $game);
      $this->service->events->delete($this->calendar_id, $eventId);
    }

    function updateEvent($name, $start, $end, $loc, $id) {
      $eventId = $this->getGcalEventId($id, $game);
      $event = new Google_Service_Calendar_Event(array(
          'summary' => $name,
          'location' => $loc,
          'start' => array(
              'dateTime' => $start,
              'timeZone' => 'America/New_York',
            ),
            'end' => array(
              'dateTime' => $end,
              'timeZone' => 'America/New_York',
            ),
      ));
      $event = $this->service->events->update($this->calendar_id, $eventId, $event);
      return $event;
    }

    private function getGcalEventId($id, $game) {
      $connection = openDatabaseConnection();
      if ($game) {
        $stmt = $connection->prepare('SELECT gcalEventId FROM games WHERE id=:id');
      } else {
        $stmt = $connection->prepare('SELECT gcalEventId FROM events WHERE id=:id');
      }
      $stmt->bindParam(':id', $id);
      $stmt->execute();
      $result = $stmt->fetch();
      return $result['gcalEventId'];
    }
}
?>